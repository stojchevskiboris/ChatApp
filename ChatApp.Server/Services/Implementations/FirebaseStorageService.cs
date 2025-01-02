using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Services.Interfaces;
using Google.Cloud.Firestore;
using Google.Cloud.Storage.V1;

namespace ChatApp.Server.Services.Implementations
{
    public class FirebaseStorageService : IFirebaseStorageService
    {
        private readonly StorageClient _storageClient;
        private const string ProjectName = "chatapp-7864e";
        private const string BucketName = $"{ProjectName}.firebasestorage.app";
        public FirebaseStorageService(StorageClient storageClient)
        {
            _storageClient = storageClient;
        }
        public async Task<Uri> UploadFile(string name, IFormFile file)
        {
            var randomGuid = Guid.NewGuid();
            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            var blob = await _storageClient.UploadObjectAsync(BucketName,
                $"{name}-{randomGuid}", file.ContentType, stream);
            var photoUri = new Uri(blob.MediaLink);
            return photoUri;
        }

        public async Task<List<Uri>> ListAllFilesAsync()
        {
            var fileUris = new List<Uri>();

            // Asynchronously list all objects in the bucket
            var objects = _storageClient.ListObjectsAsync(BucketName);

            await foreach (var storageObject in objects)
            {
                // Construct the public URL for each file
                var fileUri = new Uri($"https://storage.googleapis.com/{BucketName}/{storageObject.Name}");
                fileUris.Add(fileUri);
            }

            return fileUris;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var userId = Context.GetCurrentUserId();
            var fileName = $"avatars/{userId}/{Guid.NewGuid()}_{file.FileName}";

            using var stream = new MemoryStream();
            await file.CopyToAsync(stream);

            var storageObject = await _storageClient.UploadObjectAsync(
                BucketName,
                fileName,
                file.ContentType,
                stream);

            return $"https://firebasestorage.googleapis.com/v0/b/{BucketName}/o/{Uri.EscapeDataString(fileName)}?alt=media";

        }

        public void GetAllPhotoUris()
        {
            throw new NotImplementedException();
        }
    }
}
