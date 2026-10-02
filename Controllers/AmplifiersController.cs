using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using InteractiveData;
using InteractiveDomain;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IntereactiveView.Controllers
{
    public class AmplifiersController : Controller
    {
        private readonly MarshallContext _context;

        public AmplifiersController(MarshallContext context)
        {
            _context = context;
        }

        [HttpGet("Amplifiers/Description/{id}/{meshName}")]
        public async Task<IActionResult> Description(int id, string meshName)
        {
            var element = await _context.InteractiveElements
                .Where(a => a.InteractiveAmplifierId == id && a.MeshName == meshName).FirstOrDefaultAsync();

            return Json(element);
        }
    }
}
