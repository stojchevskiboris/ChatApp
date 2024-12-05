using AutoMapper;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.ViewModels.Groups;
using ChatApp.Server.Services.ViewModels.Messages;
using ChatApp.Server.Services.ViewModels.Users;

namespace ChatApp.Server.Data.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Define your object mappings here.
            // Example: User to UserDTO
            CreateMap<User, UserViewModel>().ReverseMap();
            CreateMap<Group, GroupViewModel>().ReverseMap();
            CreateMap<Message, MessageViewModel>().ReverseMap();
        }
    }
}
