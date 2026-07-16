using GayatriCateringPortal.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace GayatriCateringPortal.Controllers
{
    [Route("Webhook")]
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    public class WebhookController : Controller
    {
        private readonly IOrdersRepository _orders;
        private readonly IConfiguration _configuration;

        public WebhookController(IOrdersRepository orders, IConfiguration configuration)
        {
            _orders = orders;
            _configuration = configuration;
        }

        [HttpPost("razorpay")]
        public async Task<IActionResult> RazorpayWebhook()
        {
            string body;
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                body = await reader.ReadToEndAsync();
            }

            var signature = Request.Headers["X-Razorpay-Signature"].ToString();
            var webhookSecret = _configuration["PaymentGateway:Razorpay:WebhookSecret"] ?? string.Empty;

            if (string.IsNullOrWhiteSpace(webhookSecret) || !VerifySignature(body, signature, webhookSecret))
                return Unauthorized();

            try
            {
                using var json = JsonDocument.Parse(body);
                var root = json.RootElement;

                var eventName = root.TryGetProperty("event", out var eventProp) ? eventProp.GetString() : string.Empty;
                if (eventName != "payment_link.paid")
                    return Ok();

                var payloadElem = root.GetProperty("payload");
                var paymentLinkEntity = payloadElem.GetProperty("payment_link").GetProperty("entity");
                var paymentEntity = payloadElem.GetProperty("payment").GetProperty("entity");

                if (!paymentLinkEntity.TryGetProperty("notes", out var notes))
                    return Ok();

                if (!notes.TryGetProperty("orderId", out var orderIdProp))
                    return Ok();

                if (!int.TryParse(orderIdProp.GetString(), out var orderId) || orderId <= 0)
                    return Ok();

                var amountPaise = paymentEntity.TryGetProperty("amount", out var amountProp)
                    ? amountProp.GetInt64()
                    : 0;

                var amountRupees = amountPaise / 100m;

                if (amountRupees > 0)
                    _orders.UpdatePaymentFromWebhook(orderId, amountRupees);

                return Ok();
            }
            catch
            {
                return StatusCode(400);
            }
        }

        private static bool VerifySignature(string body, string signature, string secret)
        {
            if (string.IsNullOrWhiteSpace(signature))
                return false;

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(body));
            var computed = BitConverter.ToString(hash).Replace("-", string.Empty).ToLowerInvariant();
            return string.Equals(computed, signature.ToLowerInvariant(), StringComparison.Ordinal);
        }
    }
}
