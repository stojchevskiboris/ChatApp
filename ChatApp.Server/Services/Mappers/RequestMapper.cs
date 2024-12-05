using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Requests;

namespace ChatApp.Server.Services.Mappers
{
    public static class RequestMapper
    {
        public static RequestViewModel MapToViewModel(this Request model)
        {
            if (model == null)
                return null;

            return new RequestViewModel
            {
                Id = model.Id,
                UserFromId = model?.UserFrom?.Id ?? 0,
                UserToId = model?.UserTo?.Id ?? 0,
                RequestStatus = model.RequestStatus,
                IsDeleted = model.IsDeleted,
                CreatedAt = model.CreatedAt,
                ModifiedAt = model.ModifiedAt
            };
        }

        public static List<RequestViewModel> MapToViewModelList(this List<Request> requests)
        {
            return requests.Select(x => x.MapToViewModel()).ToList();
        }

        public static RequestDetailsModel MapToRequestDetailsModel(this Request model)
        {
            if (model == null)
                return null;

            return new RequestDetailsModel
            {
                Id = model.Id,
                UserFrom = model.UserFrom.MapToAddUserModel(),
                UserTo = model.UserTo.MapToAddUserModel(),
                RequestStatus = model.RequestStatus,
                IsDeleted = model.IsDeleted,
                CreatedAt = model.CreatedAt,
                ModifiedAt = model.ModifiedAt
            };
        }

        public static List<RequestDetailsModel> MapToRequestDetailsModelList(this List<Request> requests)
        {
            return requests
                .Where(x => x.UserFrom != null)
                .Select(x => x.MapToRequestDetailsModel())
                .ToList();
        }
    }
}
