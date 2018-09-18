using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Jukebox.LastFm;

namespace Test
{
    class Program
    {
        static void Main(string[] args)
        {
            TEST.TestApi();
            Console.ReadKey();
        }

        public static void test2()
        {
            var schedular = new LastFmScheduler(TimeSpan.FromSeconds(2));
            
            for (var i = 0; i < 10; i++)
            {
                schedular.ScheduleTask(new Task(() => { Console.WriteLine(DateTime.Now.ToLongTimeString()); }));
            }
            
            
        }
    }
}