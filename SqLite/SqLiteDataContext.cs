using Jukebox.Common.Abstractions.DataModel;
using Microsoft.EntityFrameworkCore;

namespace Jukebox.Database.SqLite
{
    public class SqLiteDataContext : DataContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=jukebox.db");
        }
    }
}