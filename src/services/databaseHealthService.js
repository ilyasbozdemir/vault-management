import sql from 'mssql';

// Veritabanı bağlantısını kontrol etme
export const checkDatabaseConnection = async (connectionString) => {
  try {
    const pool = await sql.connect(connectionString);
    await pool.close();
    return true;
  } catch (error) {
    console.error('Veritabanına bağlanılamadı:', error);
    return false;
  }
};

// Veritabanı boyutunu alma
export const getDatabaseSize = async (connectionString) => {
  try {
    const pool = await sql.connect(connectionString);
    const result = await pool.request().query(`
      SELECT
        CAST(SUM(size) * 8 / 1024 AS DECIMAL(18,2)) AS SizeMB
      FROM
        sys.master_files
      WHERE
        type = 0
    `);
    await pool.close();
    const sizeInGB = (result.recordset[0].SizeMB / 1024).toFixed(2); // MB'den GB'ye çevir
    return sizeInGB;
  } catch (error) {
    console.error('Veritabanı boyutu alınamadı:', error);
    return 'Bilinmiyor'; 
  }
};
