//using Microsoft.EntityFrameworkCore;
//using System;
//using InteractiveData;
//using InteractiveDomain;
//using Microsoft.Extensions.DependencyInjection;

//namespace IntereactiveView.Models
//{
//    //    public class InteractiveAmplifierModel : DbContext
//    //    {
//    //        public DbSet<Blog> Blogs { get; set; }
//    //        public DbSet<Post> Posts { get; set; }

//    //        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//    //        {
//    //            optionsBuilder.UseSqlServer(
//    //                @"Server=(localdb)\mssqllocaldb;Database=Blogging;Integrated Security=True");
//    //        }
//    //    }

//    //    public class Blog
//    //    {
//    //        public int BlogId { get; set; }
//    //        public string Url { get; set; }
//    //        public int Rating { get; set; }
//    //        public List<Post> Posts { get; set; }
//    //    }

//    //    public class Post
//    //    {
//    //        public int PostId { get; set; }
//    //        public string Title { get; set; }
//    //        public string Content { get; set; }

//    //        public int BlogId { get; set; }
//    //        public Blog Blog { get; set; }
//    //    }

//    //    [Table("InteractiveAmplifiers")]

//    //    public class Amp
//    //    {
//    //        [Key]

//    //        public string AmplifierName { get; set; }

//    //        public int Power;

//    //    }
//    public static class SeedData
//    {
//        public static void Initialize(IServiceProvider serviceProvider)
//        {
//            using (var context = new AmpContext.AmplifierModel (
//                serviceProvider.GetRequiredService<
//                    DbContextOptions<AmpContext>>()))
//            {
//                // Look for any movies.
//                if (context.Amplifier.Any())
//                {
//                    return;   // DB has been seeded
//                }

//                context.Amplifier.AddRange(
//                    new Amplifier
//                    {
//                        Name = "DSL"
//                    },

//                    new Amplifier
//                    {
//                        Name = "JCM"
//                    },

//                    new Amplifier
//                    {
//                        Name = "JMV"
//                    },

//                    new Amplifier
//                    {
//                        Name = "Natal"
//                    }
//                );
//                context.SaveChanges();
//            }
//        }

//    }
//}
