import os from 'os';

export default async function handler(req, res) {
  try {
    // Sunucu çalışma süresi (saniye)
    const uptimeInSeconds = os.uptime();
    const days = Math.floor(uptimeInSeconds / (60 * 60 * 24));
    const hours = Math.floor((uptimeInSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    // CPU Kullanımı
    const cpus = os.cpus();
    const totalIdleTime = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const totalTickTime = cpus.reduce((acc, cpu) => acc + Object.values(cpu.times).reduce((a, b) => a + b), 0);
    const cpuUsagePercent = ((1 - totalIdleTime / totalTickTime) * 100).toFixed(2);

    // Bellek Kullanımı
    const totalMemory = os.totalmem(); // Toplam bellek
    const freeMemory = os.freemem(); // Boş bellek
    const usedMemory = totalMemory - freeMemory; // Kullanılan bellek
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2); // Bellek kullanımı yüzde

    // Dinamik yanıtı döndür
    res.status(200).json({
      uptime: `${days} gün ${hours} saat ${minutes} dakika ${seconds} saniye`,
      cpuUsage: `${cpuUsagePercent}%`,
      memoryUsage: `${memoryUsagePercent}%`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu durumu alınırken hata oluştu' });
  }
}
