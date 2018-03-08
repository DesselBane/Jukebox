﻿// <auto-generated />
using Jukebox.Database.SqLite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace Jukebox.Database.SqLite.Migrations
{
    [DbContext(typeof(SqLiteDataContext))]
    partial class SqLiteDataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125");

            modelBuilder.Entity("Jukebox.Common.Abstractions.DataModel.Player", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("IsActive");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Players");
                });

            modelBuilder.Entity("Jukebox.Common.Abstractions.DataModel.Song", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Album");

                    b.Property<string>("ArtistsDb");

                    b.Property<string>("FilePath");

                    b.Property<DateTime>("LastTimeIndexed");

                    b.Property<string>("Title");

                    b.HasKey("Id");

                    b.ToTable("Songs");
                });

            modelBuilder.Entity("Jukebox.Common.Abstractions.DataModel.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("EMail");

                    b.Property<string>("Password");

                    b.Property<string>("RefreshToken");

                    b.Property<DateTime?>("RefreshTokenExpiration");

                    b.Property<string>("ResetHash");

                    b.Property<string>("Salt");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Jukebox.Common.Abstractions.DataModel.UserClaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Issuer");

                    b.Property<string>("OriginalIssuer");

                    b.Property<string>("Type")
                        .IsRequired();

                    b.Property<int>("User_Id");

                    b.Property<string>("Value")
                        .IsRequired();

                    b.Property<string>("ValueType");

                    b.HasKey("Id");

                    b.HasIndex("User_Id");

                    b.ToTable("Claims");
                });

            modelBuilder.Entity("Jukebox.Common.Abstractions.DataModel.UserClaim", b =>
                {
                    b.HasOne("Jukebox.Common.Abstractions.DataModel.User", "User")
                        .WithMany("Claims")
                        .HasForeignKey("User_Id")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
