﻿using System;
using System.Data.SqlTypes;
using System.Globalization;

namespace Jukebox.Common.Extensions
{
    public static class DateTimeExtensions
    {
        public static long ToUnixEpochDate(this DateTime date) => new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds();

        public static DateTime GetFirstCalandarDayOfMonth(this DateTime dayInMonth) =>
            new DateTime(dayInMonth.Year, dayInMonth.Month, 01).AddDays(
                                                                        -1 * (((int) new DateTime(dayInMonth.Year, dayInMonth.Month, 01).DayOfWeek + 6) % 7));

        public static DateTime GetFirstDayOfWeek(this DateTime dayInWeek) => dayInWeek.AddDays(-1 * (((int) dayInWeek.DayOfWeek + 6) % 7));

        public static int GetWeekOfYear(this DateTime    week,
                                        CalendarWeekRule weekRule  = CalendarWeekRule.FirstFourDayWeek,
                                        DayOfWeek        dayOfWeek = DayOfWeek.Monday) =>
            CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(week, weekRule, dayOfWeek);

        public static bool IsBetween(this DateTime value, DateTime start, DateTime end) => value.Date >= start.Date && value.Date <= end.Date;

        public static DateTime ToLocalTimeIfUtc(this DateTime value) => value.Kind == DateTimeKind.Utc ? value.ToLocalTime() : value;

        public static bool IsValidSqlDate(this DateTime date)
        {
            try
            {
                return (date < SqlDateTime.MaxValue && date > SqlDateTime.MinValue).IsTrue;
            } catch
            {
                return false;
            }
        }
    }
}