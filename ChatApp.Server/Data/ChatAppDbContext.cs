using ChatApp.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Drawing;

namespace ChatApp.Server.Data
{
    public class ChatAppDbContext : DbContext
    {
        public ChatAppDbContext(DbContextOptions<ChatAppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupUser> GroupUsers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Media> Media { get; set; }
        public DbSet<Recipient> Recipients { get; set; }
        public DbSet<Request> Requests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Message relationships
            modelBuilder.Entity<Message>()
                .HasOne(e => e.Sender)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(c => c.ParentMessage)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            // GroupUser relationships
            modelBuilder.Entity<GroupUser>()
                .HasOne(gu => gu.Group)
                .WithMany(g => g.GroupUsers)
                .HasForeignKey(gu => gu.GroupId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<GroupUser>()
                .HasOne(gu => gu.User)
                .WithMany()
                .HasForeignKey(gu => gu.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserContact relationships
            modelBuilder.Entity<UserContact>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.Contacts)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserContact>()
                .HasOne(uc => uc.Contact)
                .WithMany()
                .HasForeignKey(uc => uc.ContactId)
                .OnDelete(DeleteBehavior.Restrict);

            // Requests relationships
            modelBuilder.Entity<Request>()
                .HasOne(r => r.UserFrom)
                .WithMany()
                .HasForeignKey(r => r.UserFromId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Request>()
                .HasOne(r => r.UserTo)
                .WithMany()
                .HasForeignKey(r => r.UserToId)
                .OnDelete(DeleteBehavior.Restrict);

            // Eager loading
            modelBuilder.Entity<User>()
                .Navigation(u => u.Contacts)
                .AutoInclude();

            modelBuilder.Entity<GroupUser>()
                .Navigation(gu => gu.User)
                .AutoInclude();

            modelBuilder.Entity<GroupUser>()
                .Navigation(gu => gu.Group)
                .AutoInclude();

            modelBuilder.Entity<Group>()
                .Navigation(g => g.CreatedByUser)
                .AutoInclude();

            modelBuilder.Entity<Group>()
                .Navigation(g => g.GroupUsers)
                .AutoInclude();

            modelBuilder.Entity<Request>()
                .Navigation(r => r.UserFrom)
                .AutoInclude();

            modelBuilder.Entity<Request>()
                .Navigation(r => r.UserTo)
                .AutoInclude();
        }
    }
}
