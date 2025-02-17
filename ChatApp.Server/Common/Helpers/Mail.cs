using ChatApp.Server.Common.Exceptions;
using ChatApp.Server.Services.ViewModels.Common;
using System.Net.Mail;
using System.Text;

namespace ChatApp.Server.Common.Helpers
{
    public static class Mail
    {
        public static void SendMail(string to, string subject, string body, string from = null)
        {
            try
            {
                var message = new MailMessage
                {
                    IsBodyHtml = true,
                    BodyEncoding = Encoding.UTF8,
                    HeadersEncoding = Encoding.UTF8,
                    SubjectEncoding = Encoding.UTF8,
                    Subject = subject,
                    Body = body
                };

                if (!String.IsNullOrEmpty(from))
                    message.From = new MailAddress(from);

                string[] toArr = to.Split(';');
                foreach (var item in toArr)
                {
                    message.To.Add(item);
                }

                var client = new SmtpClient();
                client.UseDefaultCredentials = true;
                try
                {
                    client.Send(message);

                }
                catch (Exception ex)
                {
                    throw new CustomException(ex.Message);
                }

            }
            catch (Exception ex)
            {
                throw new CustomException(ex.Message);
            }
        }

        public static void SendMailWithAtt(string to, string subject, string body, List<EmailWithAttachmentViewModel> attachments, string from)
        {
            try
            {
                var message = new MailMessage
                {
                    IsBodyHtml = true,
                    BodyEncoding = Encoding.UTF8,
                    HeadersEncoding = Encoding.UTF8,
                    SubjectEncoding = Encoding.UTF8,
                    Subject = subject,
                    Body = body
                };

                if (attachments != null)
                {
                    foreach (var attachment in attachments)
                    {
                        var att = new Attachment(new MemoryStream(attachment.Bytes), attachment.FileName);
                        message.Attachments.Add(att);
                    }
                }

                string[] toArr = to.Split(';');
                foreach (var item in toArr)
                {
                    message.To.Add(item);
                }
                message.From = new MailAddress(from);
                var client = new SmtpClient();

                client.Send(message);

            }
            catch (Exception ex)
            {
                throw new CustomException(ex.Message);
            }
        }
    }
}
