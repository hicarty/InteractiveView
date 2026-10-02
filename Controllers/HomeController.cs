using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using IntereactiveView.Models;
using InteractiveDomain;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using InteractiveData;
using Microsoft.EntityFrameworkCore;

namespace IntereactiveView.Controllers
{
    public class HomeController : Controller
    {

        private readonly MarshallContext _context;

        public HomeController(MarshallContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Details()
        {
            ViewBag.Message = "These are the database details";

            var model = _context.InteractiveElements.ToList();

            return View(model);
        }

        [HttpGet("Home/Description/{id}/{meshName}")]
        public async Task<IActionResult> Description(int id, string meshName)
        {
            var element = await _context.InteractiveElements
                .Where(a => a.InteractiveAmplifierId == id && a.MeshName == meshName).FirstOrDefaultAsync();

            return Json(element);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        protected override void Dispose(bool disposing)
        {
            if(_context != null)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
