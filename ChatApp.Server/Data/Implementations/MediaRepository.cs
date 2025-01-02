using ChatApp.Server.Common.Constants;
using ChatApp.Server.Data.Interfaces;
using ChatApp.Server.Data.Utils;
using ChatApp.Server.Domain.Enums;
using ChatApp.Server.Domain.Models;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ChatApp.Server.Data.Implementations
{
    public class MediaRepository : Repository<Media>, IMediaRepository
    {
        private readonly ChatAppDbContext _context;

        public MediaRepository(ChatAppDbContext context) : base(context)
        {
            _context = context;
        }
    }
}