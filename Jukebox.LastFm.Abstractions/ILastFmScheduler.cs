using System.Threading.Tasks;

namespace Jukebox.LastFm.Abstractions
{
    public interface ILastFmScheduler
    {
        void ScheduleTask(Task task);
    }
}