using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Groups;

namespace ChatApp.Server.Services.Implementations
{
    public class GroupUserService : IGroupUserService
    {
        private readonly IGroupUserRepository _groupUserRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGroupRepository _groupRepository;

        public GroupUserService(IGroupUserRepository groupUserRepository, IUserRepository userRepository, IGroupRepository groupRepository)
        {
            _groupUserRepository = groupUserRepository;
            _userRepository = userRepository;
            _groupRepository = groupRepository;
        }

        public GroupUserViewModel CreateGroupUser(GroupUserViewModel model)
        {
            var user = _userRepository.Get(model.UserId);
            if (user == null)
            {
                throw new CustomException("Nonexisting user");
            }

            var group = _groupRepository.Get(model.GroupId);
            if (group == null)
            {
                throw new CustomException("Nonexisting group");
            }

            var existingGroupUser = _groupUserRepository.GetAll()
                .Where(x => x.User.Id == model.UserId && x.Group.Id == model.GroupId).Any();
            if (existingGroupUser)
            {
                throw new CustomException("User already existing in group");
            }

            var groupUser = new GroupUser()
            {
                User = user,
                Group = group,
                CreatedAt = DateTime.UtcNow,
                ModifiedAt = DateTime.UtcNow
            };

            var newGroupUser = _groupUserRepository.Create(groupUser);

            return newGroupUser.MapToViewModel();
        }

        public bool DeleteUsersByGroupId(int groupId)
        {
            var group = _groupRepository.Get(groupId);
            if (group == null)
            {
                throw new CustomException("Nonexisting group");
            }

            var groupUsers = _groupUserRepository.GetByGroupId(groupId);

            if (groupUsers.Any())
            {
                foreach (var groupUser in groupUsers)
                {
                    DeleteGroupUser(groupUser.Id);
                }
            }

            return true;
        }

        public bool DeleteGroupUser(int id)
        {
            var groupUser = GetGroupUserDomainById(id);
            _groupUserRepository.Delete(id);

            groupUser = _groupUserRepository.Get(id);
            if (groupUser == null)
            {
                return true;
            }

            return false;
        }

        public List<GroupUserViewModel> GetAllGroupUsers()
        {
            return _groupUserRepository
                .GetAllGroupUsers()
                .ToList()
                .MapToViewModelList();
        }

        public List<GroupUserViewModel> GetGroupUsersByGroupId(int groupId)
        {
            return _groupUserRepository
                .GetByGroupId(groupId)
                .MapToViewModelList();
        }

        public GroupUserViewModel GetGroupUserById(int id)
        {
            var groupUser = GetGroupUserDomainById(id);

            return groupUser.MapToViewModel();
        }

        private GroupUser GetGroupUserDomainById(int id)
        {
            var user = _groupUserRepository.Get(id);
            if (user == null)
            {
                throw new CustomException($"No groupUser found with id: {id}");
            }

            return user;
        }
    }
}
