using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Jukebox.LastFm.Abstractions;

namespace Jukebox.LastFm
{
    public class LastFmScheduler : ILastFmScheduler
    {
        private Task        _currentTask = Task.CompletedTask;
        private DateTime    _currentTaskStartTime = DateTime.Now;
        private readonly TimeSpan    _maxInterval;
        private readonly Queue<Task> _taskQueue = new Queue<Task>();
        private readonly object _threadHandle = new object();

        public LastFmScheduler(TimeSpan maxInterval)
        {
            _maxInterval = maxInterval;
        }

        public void ScheduleTask(Task task)
        {
            lock (_threadHandle)
            {
                _taskQueue.Enqueue(task);
            }
            
            RunNextTask();
        }

        private void RunNextTask()
        {
            if (_currentTask.Status <= TaskStatus.WaitingForChildrenToComplete) return;
            
            lock (_threadHandle)
            {
                if(_taskQueue.Count < 1)
                    return;
                _currentTask = _taskQueue.Dequeue();
            }

            var currentTime = DateTime.Now;
            var delay = currentTime - _maxInterval - _currentTaskStartTime;

            
            delay = delay > TimeSpan.FromSeconds(0) ? TimeSpan.FromSeconds(0) : delay.Duration();

            _currentTask.ContinueWith(task => RunNextTask());
            Task.Delay(delay)
                .ContinueWith(task =>
                              {
                                  _currentTask.Start();
                                  _currentTaskStartTime = DateTime.Now;
                              });
            
        }
    }
}