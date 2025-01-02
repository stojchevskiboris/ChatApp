namespace ChatApp.Server.Services.Interfaces
{
    public interface IFirebaseStorageService
    {
        public void GetAllPhotoUris();
        public Task<List<Uri>> ListAllFilesAsync();
        public Task<string> UploadFileAsync(IFormFile file);
    }
}
