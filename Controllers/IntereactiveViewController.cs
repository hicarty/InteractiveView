using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using IntereactiveView.Models;

namespace IntereactiveView.Controllers
{
    public class IntereactiveViewController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public JsonResult GetData(string ampStyle)
        {
            InteractiveAmp interactiveAmp = null;
            if (ampStyle == "digital")
            {
                interactiveAmp = new InteractiveAmp
                {
                    AmplifierName = "CODE",
                    InteractiveElements = new List<InteractiveElement>
                 {
                     new InteractiveSocket
                     {
                          Size = 3.5,
                          Description = "Description2",

                     },
                     new InteractiveSocket
                     {
                          Size = 7,
                          Description = "Description2",
                          InteractiveElementComponents = new List<InteractiveElement>()
                     },
                 }
                };
            }
            else
            {
                interactiveAmp = new InteractiveAmp
                {
                    AmplifierName = "DSL",
                    Power = 20,
                    InteractiveElements = new List<InteractiveElement>
                  {
                      new InteractiveButton
                      {
                          Height = 2,
                      }
                  }
                };
            }

            var json = JsonConvert.SerializeObject(interactiveAmp);

            return Json(new { data = json });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
