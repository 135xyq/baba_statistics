<template>
  <view class="container">
    <view class="content">
      <!-- 图片上传区域 -->
      <view class="upload-section">
        <text class="section-title">上传图片</text>
        <view class="upload-area" @click="chooseImage">
          <image v-if="imageUrl" :src="imageUrl" class="preview-image"></image>
          <view v-else class="upload-hint">
            <uni-icons type="camera" size="40"></uni-icons>
            <text>点击上传图片</text>
          </view>
        </view>
      </view>
      
      
      <!-- 转换参数设置 -->
      <view class="settings-section">
        <text class="section-title">转换设置</text>
        <view class="setting-item">
          <text>图纸宽度 (豆子数):</text>
          <input class="input" type="number" v-model.number="beadWidth" @input="validateNumberInput('beadWidth', 10, 500)" />
        </view>
        <view class="setting-item">
          <text>颜色数量:</text>
          <input class="input" type="number" v-model.number="colorCount" @input="validateNumberInput('colorCount', 2, 264)" />
        </view>
        <view class="setting-item-column">
          <text>选择颜色系列:</text>
          <checkbox-group @change="onColorSeriesChange" class="checkbox-group">
            <label class="checkbox-label" v-for="series in colorSeriesOptions" :key="series">
              <checkbox :value="series" :checked="selectedColorSeries.includes(series)" style="transform:scale(0.8)"></checkbox>
              {{series}}
            </label>
          </checkbox-group>
        </view>
        <button class="btn-primary" @click="convertImage" :disabled="!imageUrl">生成拼豆图纸</button>
      </view>
      
      <!-- 预览区域 -->
      <view class="preview-section" v-if="resultImage">
        <text class="section-title">图纸预览</text>
        <image :src="resultImage" class="result-image" mode="widthFix"></image>
        <button class="btn-success" @click="downloadImage">下载图纸</button>
      </view>
      
      <!-- 隐藏的Canvas用于图像处理 -->
      <canvas canvas-id="imageCanvas" :style="{ width: imageCanvasWidth + 'px', height: imageCanvasHeight + 'px', position: 'absolute', left: '-9999px' }"></canvas>
      <canvas canvas-id="resultCanvas" :style="{ width: resultCanvasWidth + 'px', height: resultCanvasHeight + 'px', position: 'absolute', left: '-9999px' }"></canvas>
    </view>
  </view>
</template>

<script>
/**
 * 拼豆图纸生成页
 * 将上传的图片转换为拼豆图纸，支持颜色量化、图纸预览和下载
 */
import beadColors from 'other/perler-beads/bead-colors.json';

export default {
  data() {
    return {
      imageUrl: '',
      resultImage: '',
      beadWidth: 50, // 默认图纸宽度
      colorCount: 264,
      allBeadColors: [],
      selectedColorSeries: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M'],
      colorSeriesOptions: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M'],
      imageCanvasWidth: 400,
      imageCanvasHeight: 400,
      resultCanvasWidth: 400,
      resultCanvasHeight: 400
    };
  },
  created() {
    this.allBeadColors = beadColors;
  },
  methods: {
    // 根据选择的系列过滤颜色
    getBeadColorChart() {
      if (!this.allBeadColors || this.allBeadColors.length === 0) {
        // 如果颜色数据尚未加载，返回空数组或默认值
        return [];
      }
      return this.allBeadColors.filter(color => this.selectedColorSeries.includes(color.code.charAt(0)));
    },
    
    onColorSeriesChange(e) {
      this.selectedColorSeries = e.detail.value;
    },
    
    validateNumberInput(field, min, max) {
      if (this[field] < min) {
        this[field] = min;
      }
      if (this[field] > max) {
        this[field] = max;
      }
    },
    
    // HEX颜色转RGB
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imageUrl = res.tempFilePaths[0];
          this.resultImage = '';
        }
      });
    },
    convertImage() {
      uni.showLoading({ title: '正在生成图纸...' });
      
      // 检查是否在H5环境中
      const isH5 = typeof window !== 'undefined' && window.document;
      
      if (isH5) {
        // H5环境下使用浏览器Canvas API
        this.convertImageH5();
      } else {
        // 非H5环境下使用uni-app Canvas API
        this.convertImageUni();
      }
    },
    
    // H5环境下的图像处理
    convertImageH5() {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.imageUrl;
      
      img.onload = () => {
        this.processImage(img, img.width, img.height, 'h5');
      };
      
      img.onerror = () => {
        uni.hideLoading();
        uni.showToast({ title: '图片加载失败', icon: 'none' });
      };
    },
    
    // 非H5环境下的图像处理
    convertImageUni() {
      uni.getImageInfo({
        src: this.imageUrl,
        success: (imgInfo) => {
          // 根据设置的图纸宽度计算尺寸
          const width = this.beadWidth;
          const height = Math.round(imgInfo.height * (width / imgInfo.width));
          
          // 动态设置 canvas 尺寸，避免图片被截断或变形
          this.imageCanvasWidth = width;
          this.imageCanvasHeight = height;
          
          // 等待 DOM 更新 canvas 尺寸
          this.$nextTick(() => {
            setTimeout(() => {
              const ctx = uni.createCanvasContext('imageCanvas', this);
              
              // 绘制原始图片
              ctx.drawImage(this.imageUrl, 0, 0, width, height);
              
              // 获取像素数据
              ctx.draw(false, () => {
                uni.canvasGetImageData({
                  canvasId: 'imageCanvas',
                  x: 0,
                  y: 0,
                  width: width,
                  height: height,
                  success: (res) => {
                    try {
                      let pixelData = res.data;
                      
                      // 使用 setTimeout 让出主线程，确保 Loading UI 能正常显示
                      setTimeout(() => {
                        try {
                          // 颜色量化（减少颜色数量）
                          const quantizedData = this.quantizeColors(pixelData, this.colorCount);
                          
                          // 生成拼豆图纸，小程序下初始渲染尺寸给 20，内部会自动防溢出
                          this.generatePerlerBeadPatternUni(quantizedData, width, height, 20, (result) => {
                            this.resultImage = result;
                            uni.hideLoading();
                          });
                        } catch (error) {
                          console.error('图像处理内部失败:', error);
                          uni.hideLoading();
                          uni.showToast({ title: '处理失败', icon: 'none' });
                        }
                      }, 50);
                      
                    } catch (error) {
                      console.error('获取图像数据失败:', error);
                      uni.hideLoading();
                      uni.showToast({ title: '处理失败', icon: 'none' });
                    }
                  },
                  fail: () => {
                    uni.hideLoading();
                    uni.showToast({ title: '处理失败', icon: 'none' });
                  }
                }, this); // 传入 this 上下文
              });
            }, 100); // 给点时间让 canvas 真正渲染
          });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: '图片加载失败', icon: 'none' });
        }
      });
    },

    processImage(image, originalWidth, originalHeight, platform) {
      // 计算缩小后的尺寸，保持宽高比
      // 根据豆粒大小调整最大尺寸，豆粒越大，图片缩得越小，从而减少豆粒数量
      const baseMaxDimension = 400; // 降低基础最大尺寸
      // 豆粒大小每增加5，最大尺寸减少150，最小保持100（进一步减少豆粒数量）
      const maxDimension = Math.max(100, baseMaxDimension - (this.beadSize - 10) * 30);
      let width = originalWidth;
      let height = originalHeight;
      
      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }
      width = Math.round(width);
      height = Math.round(height);

      if (platform === 'h5') {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(image, 0, 0, width, height);
        try {
          const imageData = tempCtx.getImageData(0, 0, width, height);
          
          // 使用 setTimeout 让出主线程，确保 Loading UI 能正常显示
          setTimeout(() => {
            try {
              const quantizedData = this.quantizeColors(imageData.data, this.colorCount);
              const result = this.generatePerlerBeadPatternH5(quantizedData, width, height, this.beadSize);
              this.resultImage = result;
            } catch (error) {
              console.error('图像处理内部失败:', error);
              uni.showToast({ title: '处理失败', icon: 'none' });
            } finally {
              uni.hideLoading();
            }
          }, 50);
          
        } catch (error) {
          console.error('获取图像数据失败:', error);
          uni.hideLoading();
          uni.showToast({ title: '处理失败', icon: 'none' });
        }
      } else { // uni
        const ctx = uni.createCanvasContext('imageCanvas');
        ctx.drawImage(image, 0, 0, width, height);
        ctx.draw(false, () => {
          uni.canvasGetImageData({
            canvasId: 'imageCanvas',
            x: 0,
            y: 0,
            width: width,
            height: height,
            success: (res) => {
              try {
                let pixelData = res.data;
                const quantizedData = this.quantizeColors(pixelData, this.colorCount);
                this.generatePerlerBeadPatternUni(quantizedData, width, height, 20, (result) => { // 固定豆子渲染尺寸为20px
                  this.resultImage = result;
                  uni.hideLoading();
                });
              } catch (error) {
                console.error('图像处理失败:', error);
                uni.hideLoading();
                uni.showToast({ title: '处理失败', icon: 'none' });
              }
            },
            fail: () => {
              uni.hideLoading();
              uni.showToast({ title: '处理失败', icon: 'none' });
            }
          });
        });
      }
    },
    
    // 改进的颜色量化函数（高性能，直接映射+频率截断）
    quantizeColors(pixelData, colorCount) {
      const allowedPalette = this.getBeadColorChart();
      if (allowedPalette.length === 0) {
        throw new Error('No color series selected');
      }

      // 转换为带RGB数值的数组以加速计算
      const palette = allowedPalette.map(c => {
        const rgb = this.hexToRgb(c.hex);
        return { ...c, r: rgb.r, g: rgb.g, b: rgb.b };
      });

      const pixelCount = pixelData.length / 4;
      const mappedIndices = new Int32Array(pixelCount);
      const colorFreq = new Int32Array(palette.length);

      // 颜色缓存，避免重复计算相同像素
      const colorCache = new Map();

      // 第一步：将每个像素映射到允许的调色板中最接近的颜色
      for (let i = 0; i < pixelCount; i++) {
        let r = pixelData[i * 4];
        let g = pixelData[i * 4 + 1];
        let b = pixelData[i * 4 + 2];
        const a = pixelData[i * 4 + 3];

        // 处理透明度（当作白色背景处理）
        if (a < 128) {
          r = 255; g = 255; b = 255;
        }

        const cacheKey = (r << 16) | (g << 8) | b;
        let bestIdx = colorCache.get(cacheKey);

        if (bestIdx === undefined) {
          let minDistance = Infinity;
          for (let p = 0; p < palette.length; p++) {
            const pc = palette[p];
            // 使用人眼感知加权距离平方，计算更快且效果更好
            const dr = r - pc.r;
            const dg = g - pc.g;
            const db = b - pc.b;
            const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
            if (dist < minDistance) {
              minDistance = dist;
              bestIdx = p;
            }
          }
          colorCache.set(cacheKey, bestIdx);
        }

        mappedIndices[i] = bestIdx;
        colorFreq[bestIdx]++;
      }

      // 第二步：如果使用的颜色数量超过了限制，则进行二次映射
      let activeColors = [];
      for (let p = 0; p < palette.length; p++) {
        if (colorFreq[p] > 0) {
          activeColors.push({ index: p, freq: colorFreq[p] });
        }
      }

      if (activeColors.length > colorCount) {
        // 按使用频率降序排序
        activeColors.sort((a, b) => b.freq - a.freq);

        const topColors = activeColors.slice(0, colorCount);
        const topIndices = topColors.map(c => c.index);

        // 为被淘汰的颜色建立重新映射表
        const remapTable = new Int32Array(palette.length);
        for (let p = 0; p < palette.length; p++) {
          if (colorFreq[p] > 0 && !topIndices.includes(p)) {
            const sourceColor = palette[p];
            let minDistance = Infinity;
            let bestTopIdx = topIndices[0];
            for (let t = 0; t < topIndices.length; t++) {
              const tc = palette[topIndices[t]];
              const dr = sourceColor.r - tc.r;
              const dg = sourceColor.g - tc.g;
              const db = sourceColor.b - tc.b;
              const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
              if (dist < minDistance) {
                minDistance = dist;
                bestTopIdx = topIndices[t];
              }
            }
            remapTable[p] = bestTopIdx;
          } else {
            remapTable[p] = p; // 保留自身
          }
        }

        // 应用重新映射表
        for (let i = 0; i < pixelCount; i++) {
          mappedIndices[i] = remapTable[mappedIndices[i]];
        }
      }

      // 第三步：生成最终的像素数据数组
      const quantized = new Array(pixelCount);
      for (let i = 0; i < pixelCount; i++) {
        const c = palette[mappedIndices[i]];
        quantized[i] = { r: c.r, g: c.g, b: c.b, beadColor: c };
      }

      return quantized;
    },
    
    // 初始化聚类中心
    initializeClusters(count) {
      const clusters = [];
      for (let i = 0; i < count; i++) {
        clusters.push({
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256)
        });
      }
      return clusters;
    },
    
    // 计算并匹配拼豆颜色统计
    calculateColorStats(quantizedData) {
      const colorStats = {};
      for (let i = 0; i < quantizedData.length; i++) {
        const color = quantizedData[i];
        const colorKey = `${color.r},${color.g},${color.b}`;
        if (!colorStats[colorKey]) {
          colorStats[colorKey] = {
            color: color,
            count: 0,
            code: color.beadColor ? color.beadColor.code : '?',
            beadColor: color.beadColor || { name: '未知颜色' }
          };
        }
        colorStats[colorKey].count++;
      }
      return colorStats;
    },
    
    // H5环境下生成拼豆图纸
    generatePerlerBeadPatternH5(quantizedData, width, height, beadSize) {
      // 计算拼豆图纸的尺寸
      const beadWidth = Math.ceil(width);
      const beadHeight = Math.ceil(height);
      
      const marginX = 60; // 左右边距（加大以容纳多位数序号）
      const marginY = 60; // 上下边距（加大以容纳多位数序号）
      
      const colorStats = this.calculateColorStats(quantizedData);
      const colorKeys = Object.keys(colorStats);
      
      // 计算图例所需的高度
      const legendCols = 4;
      const legendRows = Math.ceil(colorKeys.length / legendCols);
      const legendHeight = 40 + legendRows * 25; // 标题高度 + 图例行数 * 行高
      
      const canvasWidth = beadWidth * beadSize + marginX * 2;
      const canvasHeight = beadHeight * beadSize + marginY * 2 + legendHeight;
      
      // 创建Canvas用于绘制拼豆图纸
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      
      // 绘制白色背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // 绘制网格线
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= beadWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * beadSize + marginX, marginY);
        ctx.lineTo(x * beadSize + marginX, beadHeight * beadSize + marginY);
        ctx.stroke();
      }
      for (let y = 0; y <= beadHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(marginX, y * beadSize + marginY);
        ctx.lineTo(beadWidth * beadSize + marginX, y * beadSize + marginY);
        ctx.stroke();
      }
      
      // 绘制坐标标记 (修正对齐)
      ctx.fillStyle = '#000000';
      // 根据画布尺寸动态调整字体大小，最小 12px
      const labelFontSize = Math.max(12, Math.min(16, beadSize * 0.6));
      ctx.font = `bold ${labelFontSize}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      
      // X轴序号（顶部和底部）
      for (let x = 0; x < beadWidth; x++) {
        // 每逢 5 或 10 标记一次，避免太密。1 始终标记
        if ((x + 1) % 5 === 0 || x === 0 || x === beadWidth - 1) {
          ctx.fillText((x + 1).toString(), x * beadSize + marginX + beadSize / 2, marginY / 2);
          ctx.fillText((x + 1).toString(), x * beadSize + marginX + beadSize / 2, beadHeight * beadSize + marginY + marginY / 2);
        }
      }
      
      // Y轴序号（左侧和右侧）
      for (let y = 0; y < beadHeight; y++) {
    console.log(y,11111111111111111)
        if ((y + 1) % 5 === 0 || y === 0 || y === beadHeight - 1) {
          // 左侧序号，放置在左边距的中心点
          ctx.fillText((y + 1).toString(), marginX / 2, y * beadSize + marginY + beadSize / 2);
          // 右侧序号，放置在右边距的中心点
          ctx.fillText((y + 1).toString(), canvasWidth - marginX / 2, y * beadSize + marginY + beadSize / 2);
        }
      }
      
      // 绘制拼豆
      for (let y = 0; y < beadHeight; y++) {
        for (let x = 0; x < beadWidth; x++) {
          // 使用原始宽度计算索引，避免超出范围
          const index = y * Math.floor(width) + x;
          if (index < quantizedData.length) {
            const color = quantizedData[index];
            const colorKey = `${color.r},${color.g},${color.b}`;
            const stat = colorStats[colorKey];
            
            // 绘制圆形豆粒
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            ctx.beginPath();
            ctx.arc(x * beadSize + marginX + beadSize / 2, y * beadSize + marginY + beadSize / 2, beadSize / 2 - 1, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制边框
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            // 绘制颜色代码
            if (beadSize >= 15 && stat && stat.code) {
              ctx.fillStyle = '#000000';
              ctx.font = `${Math.max(8, beadSize * 0.4)}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(stat.code, x * beadSize + marginX + beadSize / 2, y * beadSize + marginY + beadSize / 2);
            }
          }
        }
      }
      
      // 绘制颜色图例
      const legendStartY = beadHeight * beadSize + marginY * 2;
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('颜色图例 (总数: ' + quantizedData.length + ' 颗):', marginX, legendStartY);
      
      // 动态计算图例列宽
      const legendItemWidth = (canvasWidth - marginX * 2) / legendCols;
      
      // 按使用频率排序图例
      const sortedKeys = colorKeys.sort((a, b) => colorStats[b].count - colorStats[a].count);
      
      sortedKeys.forEach((key, index) => {
        const colorStat = colorStats[key];
        const col = index % legendCols;
        const row = Math.floor(index / legendCols);
        
        const x = marginX + col * legendItemWidth;
        const y = legendStartY + 30 + row * 25;
        
        // 绘制颜色块
        ctx.fillStyle = `rgb(${colorStat.color.r}, ${colorStat.color.g}, ${colorStat.color.b})`;
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        // 绘制颜色代码、名称和数量
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // 截断过长的名字
        let displayName = colorStat.beadColor.name;
        if (displayName.length > 8) {
           displayName = displayName.substring(0, 7) + '.';
        }
        
        ctx.fillText(`${colorStat.code} ${displayName} x${colorStat.count}`, x + 22, y + 8);
      });
      
      // 转换为图片URL
      return canvas.toDataURL('image/png');
    },
    
    // 非H5环境下生成拼豆图纸
    generatePerlerBeadPatternUni(quantizedData, width, height, initialBeadSize, callback) {
      // 计算拼豆图纸的尺寸
      const beadWidth = Math.ceil(width);
      const beadHeight = Math.ceil(height);
      
      // 防止生成尺寸过大导致内存溢出
      let beadSize = initialBeadSize;
      if (beadWidth * beadSize > 2000) {
        beadSize = Math.floor(2000 / beadWidth);
        if (beadSize < 5) beadSize = 5;
      }
      
      const marginX = 60; // 左右边距（加大以容纳多位数序号）  
      const marginY = 60; // 上下边距（加大以容纳多位数序号）
      
      const colorStats = this.calculateColorStats(quantizedData);
      const colorKeys = Object.keys(colorStats);
      
      // 计算图例所需的高度
      // 小程序中，如果一行放 4 个图例太挤，改为放 3 个，并增加行高
      const legendCols = 3;
      const legendRows = Math.ceil(colorKeys.length / legendCols);
      const legendRowHeight = 35; // 增加行高，防止上下重叠
      const legendHeight = 50 + legendRows * legendRowHeight;
      
      const canvasWidth = beadWidth * beadSize + marginX * 2;
      const canvasHeight = beadHeight * beadSize + marginY * 2 + legendHeight;
      
      // 动态调整 canvas 尺寸
      this.resultCanvasWidth = canvasWidth;
      this.resultCanvasHeight = canvasHeight;
      
      uni.showLoading({ title: '准备绘制图纸...' });
      
      this.$nextTick(() => {
        setTimeout(() => {
          // 使用uni-app的Canvas API
          const ctx = uni.createCanvasContext('resultCanvas', this);
          
          // 绘制白色背景
          ctx.setFillStyle('#ffffff');
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          
          // 绘制网格线
          ctx.setStrokeStyle('#e0e0e0');
          ctx.setLineWidth(0.5);
          for (let x = 0; x <= beadWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * beadSize + marginX, marginY);
            ctx.lineTo(x * beadSize + marginX, beadHeight * beadSize + marginY);
            ctx.stroke();
          }
          for (let y = 0; y <= beadHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(marginX, y * beadSize + marginY);
            ctx.lineTo(beadWidth * beadSize + marginX, y * beadSize + marginY);
            ctx.stroke();
          }
          
          // 绘制坐标标记
          ctx.setFillStyle('#000000');
          const labelFontSize = Math.max(12, Math.min(16, beadSize * 0.6));
          ctx.setFontSize(labelFontSize);
          ctx.setTextBaseline('middle');
          ctx.setTextAlign('center');
          
          for (let x = 0; x < beadWidth; x++) {
            ctx.fillText((x + 1).toString(), x * beadSize + marginX + beadSize / 2, marginY / 2);
            ctx.fillText((x + 1).toString(), x * beadSize + marginX + beadSize / 2, beadHeight * beadSize + marginY + marginY / 2);
       
          }
          
          for (let y = 0; y < beadHeight; y++) {
            // 统一使用 center 对齐，并放在左右留白区域的正中心
            // 左侧中心点：marginX / 2
            ctx.fillText((y + 1).toString(), marginX / 2, y * beadSize + marginY + beadSize / 2);
            // 右侧中心点：canvasWidth - marginX / 2
              ctx.fillText((y + 1).toString(), canvasWidth - marginX / 2, y * beadSize + marginY + beadSize / 2);
    
          }
          
          // 绘制颜色图例
          const legendStartY = beadHeight * beadSize + marginY * 2;
          ctx.setFillStyle('#000000');
          ctx.setFontSize(16); // 稍微调大标题字体
          ctx.setTextAlign('left');
          ctx.setTextBaseline('top');
          ctx.fillText('颜色图例 (总数: ' + quantizedData.length + ' 颗):', marginX, legendStartY);
          
          const legendItemWidth = (canvasWidth - marginX * 2) / legendCols;
          const sortedKeys = colorKeys.sort((a, b) => colorStats[b].count - colorStats[a].count);
          
          sortedKeys.forEach((key, index) => {
            const colorStat = colorStats[key];
            const col = index % legendCols;
            const row = Math.floor(index / legendCols);
            
            // X 坐标适当增加内部间距
            const x = marginX + col * legendItemWidth;
            const y = legendStartY + 40 + row * legendRowHeight; // 距标题的间距增加到 40
            
            // 绘制颜色块 (改用圆点与图纸统一)
            ctx.setFillStyle(`rgb(${colorStat.color.r}, ${colorStat.color.g}, ${colorStat.color.b})`);
            ctx.beginPath();
            ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2); // 稍微调大颜色圆点
            ctx.fill();
            ctx.setStrokeStyle('#000000');
            ctx.setLineWidth(1); // 加粗边框让圆点更明显
            ctx.stroke();
            
            // 绘制颜色代码、名称和数量
            ctx.setFillStyle('#000000');
            ctx.setFontSize(13); // 调大文字，提高清晰度
            ctx.setTextBaseline('middle');
            
            // 进一步缩短过长的名字，防止重叠
            let displayName = colorStat.beadColor.name;
            if (displayName.length > 5) {
               displayName = displayName.substring(0, 4) + '..';
            }
            
            ctx.fillText(`${colorStat.code} ${displayName} x${colorStat.count}`, x + 26, y + 10);
          });
          
          // 先绘制一次背景、网格和图例
          ctx.draw(false, () => {
            // 开始分块绘制拼豆
            let currentY = 0;
            const rowsPerChunk = 5; // 每次绘制5行，防止桥接通信卡死
            
            const drawNextChunk = () => {
              if (currentY >= beadHeight) {
                // 绘制完成，导出图片
                uni.showLoading({ title: '正在导出图片...' });
                setTimeout(() => {
                  uni.canvasToTempFilePath({
                    canvasId: 'resultCanvas',
                    success: (res) => {
                      callback(res.tempFilePath);
                    },
                    fail: (err) => {
                      console.error('导出图片失败', err);
                      uni.showToast({ title: '生成失败', icon: 'none' });
                    }
                  }, this);
                }, 300);
                return;
              }
              
              // 更新进度提示
              uni.showLoading({ title: `绘制进度 ${Math.round((currentY / beadHeight) * 100)}%` });
              
              const endY = Math.min(currentY + rowsPerChunk, beadHeight);
              
              for (let y = currentY; y < endY; y++) {
                for (let x = 0; x < beadWidth; x++) {
                  // 使用原始宽度计算索引，避免超出范围
                  const index = y * Math.floor(width) + x;
                  if (index < quantizedData.length) {
                    const color = quantizedData[index];
                    const colorKey = `${color.r},${color.g},${color.b}`;
                    const stat = colorStats[colorKey];
                    
                    // 为了性能，如果豆子太小，可以直接用fillRect代替arc
                    ctx.setFillStyle(`rgb(${color.r}, ${color.g}, ${color.b})`);
                    if (beadSize <= 5) {
                      ctx.fillRect(x * beadSize + marginX, y * beadSize + marginY, beadSize, beadSize);
                    } else {
                      ctx.beginPath();
                      ctx.arc(x * beadSize + marginX + beadSize / 2, y * beadSize + marginY + beadSize / 2, beadSize / 2 - 1, 0, Math.PI * 2);
                      ctx.fill();
                      
                      // 绘制边框
                      ctx.setStrokeStyle('#000000');
                      ctx.setLineWidth(0.5);
                      ctx.stroke();
                    }
                    
                    // 绘制颜色代码
                    if (beadSize >= 15 && stat && stat.code) { // 豆子足够大才绘制文字
                      ctx.setFillStyle('#000000');
                      ctx.setFontSize(Math.max(8, beadSize * 0.4));
                      ctx.setTextAlign('center');
                      ctx.setTextBaseline('middle');
                      ctx.fillText(stat.code, x * beadSize + marginX + beadSize / 2, y * beadSize + marginY + beadSize / 2);
                      ctx.setTextAlign('left'); // 恢复默认
                    }
                  }
                }
              }
              
              currentY = endY;
              
              // 使用 true 表示追加绘制
              ctx.draw(true, () => {
                // 留出时间给 UI 渲染和事件循环
                setTimeout(drawNextChunk, 20);
              });
            };
            
            drawNextChunk();
          });
        }, 100);
      });
    },
    
    downloadImage() {
      // 检查是否在H5环境中
      const isH5 = typeof window !== 'undefined' && window.document;
      
      if (isH5) {
        // H5环境下直接下载
        this.downloadImageH5();
      } else {
        // 非H5环境下使用uni-app API
        this.downloadImageUni();
      }
    },
    
    // H5环境下的下载
    downloadImageH5() {
      if (typeof window !== 'undefined' && window.document) {
        const link = document.createElement('a');
        link.href = this.resultImage;
        link.download = 'perler-bead-pattern.png';
        link.click();
        uni.showToast({ title: '图纸已开始下载' });
      } else {
        uni.showToast({ title: '当前环境不支持下载', icon: 'none' });
      }
    },
    
    // 非H5环境下的下载
    downloadImageUni() {
      uni.getSetting({
        success: (settingRes) => {
          if (settingRes.authSetting['scope.writePhotosAlbum']) {
            this.doSaveImage();
          } else {
            uni.authorize({
              scope: 'scope.writePhotosAlbum',
              success: () => {
                this.doSaveImage();
              },
              fail: () => {
                uni.showModal({
                  title: '提示',
                  content: '需要您授权保存图片到相册，是否前往设置开启权限？',
                  confirmText: '去设置',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      uni.openSetting();
                    }
                  }
                });
              }
            });
          }
        }
      });
    },

    doSaveImage() {
      const filePath = this.resultImage;
      if (!filePath) {
        uni.showToast({ title: '暂无图纸可下载', icon: 'none' });
        return;
      }

      uni.showLoading({ title: '正在保存...' });

      uni.getImageInfo({
        src: filePath,
        success: (imageInfo) => {
          uni.saveImageToPhotosAlbum({
            filePath: imageInfo.path,
            success: () => {
              uni.hideLoading();
              uni.showToast({ title: '已保存到相册' });
            },
            fail: (err) => {
              uni.hideLoading();
              console.error('保存失败:', err);
              if (err.errMsg && err.errMsg.includes('auth deny')) {
                uni.showModal({
                  title: '提示',
                  content: '需要您授权保存图片到相册，是否前往设置开启权限？',
                  confirmText: '去设置',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      uni.openSetting();
                    }
                  }
                });
              } else {
                uni.showToast({ title: '保存失败，请重试', icon: 'none' });
              }
            }
          });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: '图片读取失败', icon: 'none' });
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #4CAF50;
  color: white;
  padding: 20rpx;
  text-align: center;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.content {
  padding: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  color: #333;
}

.settings-section {
  margin-bottom: 30rpx;
  background-color: white;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}

.input {
  width: 120rpx;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 8rpx;
  padding: 8rpx 12rpx;
  font-size: 28rpx;
  background-color: #fafafa;
}

.setting-item-column {
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #555;
  background: #f5f5f5;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.preview-section {
  background-color: white;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}

.result-image {
  width: 100%;
  height: auto;
  min-height: 600rpx;
  margin-bottom: 24rpx;
  border-radius: 10rpx;
  object-fit: contain;
  background-color: #f9f9f9;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  border-radius: 40rpx;
  font-size: 30rpx;
  margin-top: 20rpx;
}
.btn-primary[disabled] {
  background-color: #a5d6a7;
}

.btn-success {
  background-color: #008CBA;
  color: white;
  border-radius: 40rpx;
  font-size: 30rpx;
}

.upload-area {
  width: 100%;
  height: 350rpx;
  border: 3rpx dashed #ccc;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  transition: all 0.3s;
}
.upload-area:active {
  background-color: #f0f0f0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12rpx;
}

.upload-section {
  margin-bottom: 30rpx;
  background-color: white;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
</style>