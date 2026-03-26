import Band from "../../models/Band.js";
import { deleteCloudinaryAssetByUrl } from "../../utils/deleteCloudinaryAssetByUrl.js";
import { sortBandMembers } from "../../utils/sortBandMembers.js";

function isTempId(id) {
  return typeof id === "string" && id.startsWith("temp-");
}

export async function updateBand(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id !== id || req.user.type !== "band") {
      return res.status(403).json({ message: "Acesso negado" });
    }

    const existingBand = await Band.findById(id);

    if (!existingBand) {
      return res.status(404).json({ message: "Banda não encontrada" });
    }

    const data = { ...req.body };

    if (data.address) {
      data.address = JSON.parse(data.address);
    }

    if (data.members) {
      data.members = JSON.parse(data.members);
    }

    if (!Array.isArray(data.members)) {
      data.members = existingBand.members.map((member) => member.toObject());
    }

    const files = req.files || [];

    const profilePictureFile = files.find(
      (file) => file.fieldname === "profilePicture"
    );

    const coverPictureFile = files.find(
      (file) => file.fieldname === "coverPicture"
    );

    if (profilePictureFile) {
      data.profilePicture = profilePictureFile.path;
    }

    if (coverPictureFile) {
      data.coverPicture = coverPictureFile.path;
    }

    const oldMembers = existingBand.members.map((member) => ({
      id: member._id.toString(),
      photo: member.photo || "",
    }));

    const newMemberIds = data.members
      .filter((member) => member.id || member._id)
      .map((member) => String(member.id || member._id))
      .filter((memberId) => !isTempId(memberId));

    for (const oldMember of oldMembers) {
      if (!newMemberIds.includes(oldMember.id) && oldMember.photo) {
        await deleteCloudinaryAssetByUrl(oldMember.photo);
      }
    }

    for (const file of files) {
      if (file.fieldname.startsWith("memberPhoto_")) {
        const memberId = file.fieldname.replace("memberPhoto_", "");

        const memberIndex = data.members.findIndex(
          (member) => String(member.id || member._id) === memberId
        );

        if (memberIndex !== -1) {
          const currentMember = data.members[memberIndex];

          if (
            currentMember.photo &&
            typeof currentMember.photo === "string" &&
            currentMember.photo !== file.path
          ) {
            await deleteCloudinaryAssetByUrl(currentMember.photo);
          }

          data.members[memberIndex].photo = file.path;
        }
      }
    }

    data.members = data.members.map((member) => {
      const normalizedMember = { ...member };

      if (normalizedMember.id && !normalizedMember._id) {
        if (!isTempId(normalizedMember.id)) {
          normalizedMember._id = normalizedMember.id;
        }
      }

      delete normalizedMember.id;

      if (normalizedMember._id && isTempId(String(normalizedMember._id))) {
        delete normalizedMember._id;
      }

      return normalizedMember;
    });

    data.members = sortBandMembers(data.members);

    const updated = await Band.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select(
      "name description year musicalGenre address members profilePicture coverPicture socialLinks createdAt"
    );

    return res.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar banda:", error);
    return res.status(500).json({ message: "Erro ao atualizar banda" });
  }
}