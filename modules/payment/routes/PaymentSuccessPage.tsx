export function PaymentSuccessPage() {
  return (
    <main className="section">
      <div className="section-heading">
        <p className="eyebrow">Payment</p>
        <h1>Payment Successful</h1>
        <p>Your Stable Audio 3 credits will be available after the transaction is confirmed.</p>
      </div>
      <div className="mx-auto max-w-2xl surface-card text-center">
        <h2 className="text-2xl font-semibold text-white">You can return to the generator</h2>
        <p className="mt-3 text-slate-400">If your balance does not update immediately, refresh your account page after a few seconds.</p>
        <a className="button-primary mt-6" href="/stable-audio-3">
          Create Audio
        </a>
      </div>
    </main>
  );
}
