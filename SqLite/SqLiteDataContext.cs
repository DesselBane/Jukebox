using Jukebox.Common.Abstractions.DataModel;
using Microsoft.EntityFrameworkCore;

namespace Jukebox.Database.SqLite
{
    public class SqLiteDataContext : DataContext
    {
        private readonly string _connectionString;

        public SqLiteDataContext() : this("Data Source=jukebox.db")
        {
            
        }
        
        public SqLiteDataContext(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(_connectionString);
        }
    }
}