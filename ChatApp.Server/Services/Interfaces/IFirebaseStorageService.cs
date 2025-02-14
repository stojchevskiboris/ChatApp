namespace ChatApp.Server.Services.Interfaces
{
    public interface IFirebaseStorageService
    {
        public void GetAllPhotoUris();
        public Task<List<Uri>> ListAllFilesAsync();
        public Task<string> UploadAvatarFileAsync(IFormFile file);
        public Task<string> UploadMediaFileAsync(IFormFile file);
    }
}
