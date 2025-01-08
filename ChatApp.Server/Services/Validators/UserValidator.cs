using ChatApp.Server.Domain.Models;
using FluentValidation;

namespace ChatApp.Server.Services.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            //RuleFor(x => x.Email).EmailAddress();
        }
    }
}
