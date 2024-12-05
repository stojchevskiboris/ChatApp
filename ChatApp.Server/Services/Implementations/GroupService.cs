using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Groups;

namespace ChatApp.Server.Services.Implementations
{
    public class GroupService : IGroupService
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;
        private readonly IGroupUserService _groupUserService;

        public GroupService(
            IGroupRepository groupRepository,
            IUserRepository userRepository,
            IGroupUserService groupUserService)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
            _groupUserService = groupUserService;
        }

        public List<GroupViewModel> GetAllGroups()
        {
            return _groupRepository.GetAll()
                .ToList()
                .MapToViewModelList();
        }

        public GroupViewModel GetGroupById(int id)
        {
            var group = GetGroupDomainById(id);

            return group.MapToViewModel();
        }

        public GroupViewModel CreateGroup(GroupViewModel model)
        {
            // ToDo: Validate model
            if (model.CreatedByUser == null || model.CreatedByUser.Id == 0)
            {
                throw new CustomException("Invalid parameters");
            }

            var createdByUser = _userRepository.Get(model.CreatedByUser.Id);
            if (createdByUser == null)
            {
                throw new CustomException("Nonexisting user");
            }

            var group = new Group();
            group.Name = model.Name;
            group.CreatedByUser = createdByUser;
            group.CreatedAt = DateTime.Now;
            group.ModifiedAt = DateTime.Now;

            var newGroup = _groupRepository.Create(group);

            // add createdByUser to groupUsers
            var groupUser = new GroupUserViewModel()
            {
                GroupId = newGroup.Id,
                UserId = createdByUser.Id,
                CreatedAt = DateTime.Now,
                ModifiedAt = DateTime.Now
            };

            _groupUserService.CreateGroupUser(groupUser);

            return newGroup.MapToViewModel();
        }

        public GroupViewModel UpdateGroup(GroupViewModel model)
        {
            var group = GetGroupDomainById(model.Id);

            group.Name = model.Name;
            group.ModifiedAt = DateTime.Now;

            _groupRepository.Update(group);

            return group.MapToViewModel();
        }

        public bool DeleteGroup(int id)
        {
            var group = GetGroupDomainById(id);

            // delete users from group
            _groupUserService.DeleteGroupUser(id);

            _groupRepository.Delete(id);
            group = _groupRepository.Get(id);
            if (group == null)
            {
                return true;
            }
            return false;
        }


        private Group GetGroupDomainById(int id)
        {
            var group = _groupRepository.Get(id);
            if (group == null)
            {
                throw new CustomException($"No group found with id: {id}");
            }

            return group;
        }
    }
}
