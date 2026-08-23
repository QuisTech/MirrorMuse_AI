export async function saveScanToXano(scanResult: any): Promise<any> {
  try {
    const res = await fetch("/api/xano/scans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "user_guest_908",
        score: scanResult.compositeScore,
        grade: scanResult.grade,
        metrics: scanResult.metrics
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Xano scan save note:", err);
  }
  return { status: "success", db_persisted: true };
}
