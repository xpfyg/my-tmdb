import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'video_resource_db',
  charset: 'utf8mb4',
  connectionLimit: 10,
};

let pool: mysql.Pool | null = null;

export const createPool = async (): Promise<mysql.Pool> => {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      console.log('MySQL连接池创建成功');
    } catch (error) {
      console.error('MySQL连接池创建失败:', error);
      throw error;
    }
  }
  return pool;
};

export const getConnection = async (): Promise<mysql.PoolConnection> => {
  const pool = await createPool();
  return pool.getConnection();
};

export const query = async (sql: string, params?: any[]): Promise<any> => {
  // 如果没有提供参数，直接执行SQL
  if (!params || params.length === 0) {
    const pool = await createPool();
    try {
      const [rows] = await pool.execute(sql);
      return rows;
    } catch (error) {
      console.error('SQL查询执行失败:', error);
      throw error;
    }
  }
  
  // 如果有参数，使用参数化查询
  const pool = await createPool();
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('SQL查询执行失败:', error);
    throw error;
  }
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('MySQL连接池已关闭');
  }
};

export default {
  createPool,
  getConnection,
  query,
  closePool,
};