import musicModel from "../models/music.model.js";
import { uploadFile, getSignedUrlForAccess } from "../services/storage.service.js";

export async function createMusic(req, res) {

    const musicFile = req.files[ "music" ][ 0 ];
    const coverImageFile = req.files[ "coverImage" ][ 0 ];

    const music = await uploadFile(musicFile);
    const coverImage = await uploadFile(coverImageFile);

    const musicDoc = await musicModel.create({
        title: req.body.title,
        artist: req.user.fullName.firstName + " " + req.user.fullName.lastName,
        artistId: req.user.id,
        musicUrl: music,
        coverImageUrl: coverImage
    })

    res.status(201).json({
        message: "Music created successfully",
        music: {
            id: musicDoc._id,
            title: musicDoc.title,
            artist: musicDoc.artist,
            musicUrl: await getSignedUrlForAccess(musicDoc.musicUrl),
            coverImageUrl: await getSignedUrlForAccess(musicDoc.coverImageUrl)
        }
    })


}