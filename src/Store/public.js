import baseService from "./baseService";

export default class PublicService extends baseService {
  // constructor() {
  //   super();
  //   this.schemaName = "public";
  // }

  getAllSongs(entity) {
    return this.postObject("GetAllSong", entity);
  }
  deleteSong(entity) {
    return this.postObject("DeleteSong", entity);
  }
  getSongLyric(entity) {
    return this.postObject("GetLyric", entity);
  }
  userLogin(entity) {
    return this.postObject("login", entity);
  }
  refreshToken(entity) {
    return this.postObject("refresh", entity);
  }
}