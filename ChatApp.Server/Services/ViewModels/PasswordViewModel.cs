﻿namespace ChatApp.Server.Services.ViewModels
{
    public class PasswordViewModel
    {
        public int UserId { get; set; }

        public string OldPassword { get; set; }

        public string NewPassword { get; set; }

        public string ConfirmPassword { get; set; }
    }
}
