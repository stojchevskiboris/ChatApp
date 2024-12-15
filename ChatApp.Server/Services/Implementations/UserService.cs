using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Common.Helpers;
using ChatApp.Server.Configs.Authentication;
using ChatApp.Server.Configs.Authentication.Models;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Services.Interfaces;
using ChatApp.Server.Services.Mappers;
using ChatApp.Server.Services.ViewModels.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChatApp.Server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRequestRepository _requestRepository;
        private readonly AppSettings _appSettings;

        public UserService(IUserRepository userRepository, IRequestRepository requestRepository, IOptions<AppSettings> appSettings)
        {
            _userRepository = userRepository;
            _requestRepository = requestRepository;
            _appSettings = appSettings.Value;
        }

        public List<UserViewModel> GetAllUsers()
        {
            return _userRepository.GetAll()
                .ToList()
                .MapToViewModelList();
        }

        public UserViewModel GetUserById(int id)
        {
            var user = GetUserDomainById(id);

            return user.MapToViewModel();
        }

        public List<UserViewModel> GetContacts()
        {
            var contacts = new List<UserViewModel>();

            var currentUserId = Context.GetCurrentUserId();
            var currentUser = _userRepository.Get(currentUserId);
            if (currentUser == null)
            {
                throw new CustomException("User not existing");
            }

            var contactsId = _userRepository.GetContactsByUserId(currentUserId);

            if (contactsId.Any())
            {
                foreach (var id in contactsId)
                {
                    var contact = _userRepository.Get(id);
                    if(contact != null)
                    {
                        contacts.Add(contact.MapToViewModel());
                    }
                }
            }

            return contacts;
        }

        public UserViewModel GetUserByEmail(string email)
        {
            var user = _userRepository.GetByEmail(email.Trim());
            if (user == null)
            {
                throw new CustomException($"No user found with email: {email}");
            }

            return user.MapToViewModel();
        }

        public UserViewModel CreateUser(UserRegisterModel model)
        {
            if (_userRepository.GetAll().Where(x => x.Email == model.Email).Any())
            {
                throw new CustomException("There is already registered user with the provided Email");
            }

            if (model.Password != model.ConfirmPassword)
            {
                throw new CustomException("Passwords must match");
            }

            User user = new User();
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.Phone = model.Phone;
            user.Password = PasswordHelper.HashPassword(model.Password);
            user.DateOfBirth = DateTime.Parse(model.DateOfBirth);
            user.CreatedAt = DateTime.Now;
            user.ModifiedAt = DateTime.Now;

            var newUser = _userRepository.Create(user);
            return newUser.MapToViewModel();
        }

        public UserViewModel UpdateUser(UserViewModel model)
        {
            var user = GetUserDomainById(model.Id);

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;
            user.Phone = model.Phone;
            user.DateOfBirth = model.DateOfBirth;
            user.ModifiedAt = DateTime.Now;

            _userRepository.Update(user);

            return user.MapToViewModel();
        }

        public bool DeleteUser(int id)
        {
            var user = GetUserDomainById(id);
            _userRepository.Delete(id);

            user = _userRepository.Get(id);
            if (user == null)
            {
                return true;
            }

            return false;
        }

        public bool ChangePassword(PasswordViewModel model)
        {
            if (model == null)
            {
                throw new CustomException("Invalid parameters");
            }

            if (string.IsNullOrEmpty(model.OldPassword)
                || string.IsNullOrEmpty(model.NewPassword)
                || string.IsNullOrEmpty(model.ConfirmPassword))
            {
                throw new CustomException("Invalid parameters");
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                throw new CustomException("Passwords do not match!");
            }

            if (!PasswordHelper.CheckPasswordStrength(model.NewPassword))
            {
                throw new CustomException("Passwords must contain at least 8 characters!");
            }

            var user = GetUserDomainById(model.UserId);

            var hashedOldPassword = user.Password;
            var hashedNewPassword = PasswordHelper.HashPassword(model.NewPassword);

            if (hashedOldPassword == hashedNewPassword)
            {
                throw new CustomException("New password cannot be same as old password!");
            }

            user.Password = hashedNewPassword;
            _userRepository.Update(user);

            return true;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model)
        {
            var user = _userRepository.GetByEmail(model.Username);
            if (user == null)
            {
                return null; // Nonexisting email
            }

            var checkPassword = PasswordHelper.HashPassword(model.Password);
            if (checkPassword != user.Password)
            {
                return null; // Incorrect passowrd
            }

            var token = GenerateJwtToken(user);

            return new AuthenticateResponse(user, token);
        }

        public AuthenticateResponse AuthenticateWithJwt(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new CustomException("Session expired, please log in again.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            try
            {
                // Validate the token
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero // No delay for token expiration
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(claim => claim.Type == "id").Value);

                // Get the user by ID
                var user = _userRepository.Get(userId);
                if (user == null)
                {
                    throw new CustomException("User not found");
                }

                // Generate a new JWT token for the response
                var newToken = GenerateJwtToken(user);

                return new AuthenticateResponse(user, newToken);
            }
            catch (Exception)
            {
                return null;
                //throw new CustomException("Session expired, please log in again.");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private User GetUserDomainById(int id)
        {
            var user = _userRepository.Get(id);
            if (user == null)
            {
                throw new CustomException($"No user found with id: {id}");
            }

            return user;
        }
    }
}
