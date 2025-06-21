const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const fs = require('fs');
const path = require('path');

// Paths
const paths = {
  images: {
    src: 'dist/assets/**/*.{jpg,jpeg,png,gif,svg,webp}',
    dest: 'dist/assets/optimized/'
  },
  css: {
    src: 'dist/assets/**/*.css',
    dest: 'dist/assets/'
  },
  js: {
    src: 'dist/assets/**/*.js',
    dest: 'dist/assets/'
  },
  build: 'dist/'
};

// Image optimization task
async function optimizeImages() {
  const { default: imagemin } = await import('imagemin');
  const { default: imageminMozjpeg } = await import('imagemin-mozjpeg');
  const { default: imageminPngquant } = await import('imagemin-pngquant');
  const { default: imageminSvgo } = await import('imagemin-svgo');
  const { default: imageminWebp } = await import('imagemin-webp');

  console.log('🖼️  Optimizing images...');
  
  try {
    const files = await imagemin([paths.images.src], {
      destination: paths.images.dest,
      plugins: [
        // JPEG optimization
        imageminMozjpeg({
          quality: 85,
          progressive: true
        }),
        // PNG optimization
        imageminPngquant({
          quality: [0.65, 0.8],
          speed: 4
        }),
        // SVG optimization
        imageminSvgo({
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'cleanupIDs', active: false }
          ]
        }),
        // WebP conversion for better compression
        imageminWebp({
          quality: 80,
          method: 6
        })
      ]
    });

    console.log(`✅ Optimized ${files.length} images`);
    
    // Generate optimization report
    generateOptimizationReport(files);
    
    return files;
  } catch (error) {
    console.error('❌ Image optimization failed:', error);
    throw error;
  }
}

// CSS optimization task
function optimizeCSS() {
  console.log('🎨 Optimizing CSS...');
  
  return gulp.src(paths.css.src)
    .pipe(cleanCSS({
      level: 2,
      returnPromise: true
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css.dest))
    .on('end', () => console.log('✅ CSS optimization completed'));
}

// JavaScript optimization task
function optimizeJS() {
  console.log('📦 Optimizing JavaScript...');
  
  return gulp.src(paths.js.src)
    .pipe(uglify({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      mangle: true
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js.dest))
    .on('end', () => console.log('✅ JavaScript optimization completed'));
}

// Generate optimization report
function generateOptimizationReport(optimizedFiles) {
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: optimizedFiles.length,
    totalSavedBytes: 0,
    files: []
  };

  optimizedFiles.forEach(file => {
    const stats = fs.statSync(file.sourcePath);
    const optimizedStats = fs.statSync(file.destinationPath);
    const savedBytes = stats.size - optimizedStats.size;
    const compressionRatio = ((savedBytes / stats.size) * 100).toFixed(2);

    report.totalSavedBytes += savedBytes;
    report.files.push({
      filename: path.basename(file.sourcePath),
      originalSize: formatBytes(stats.size),
      optimizedSize: formatBytes(optimizedStats.size),
      saved: formatBytes(savedBytes),
      compressionRatio: `${compressionRatio}%`
    });
  });

  // Save report
  const reportPath = path.join(paths.build, 'optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📊 Optimization Report:`);
  console.log(`   Total files: ${report.totalFiles}`);
  console.log(`   Total saved: ${formatBytes(report.totalSavedBytes)}`);
  console.log(`   Report saved: ${reportPath}`);
}

// Bundle analysis task
function analyzeBundles() {
  console.log('📊 Analyzing bundle sizes...');
  
  const distPath = paths.build;
  const analysis = {
    timestamp: new Date().toISOString(),
    assets: [],
    totalSize: 0,
    gzippedEstimate: 0
  };

  // Read all files in dist
  function readDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        readDirectory(filePath);
      } else {
        const ext = path.extname(file);
        const size = stats.size;
        const relativePath = path.relative(distPath, filePath);
        
        analysis.assets.push({
          name: relativePath,
          size: formatBytes(size),
          sizeBytes: size,
          type: getAssetType(ext),
          gzippedEstimate: formatBytes(Math.round(size * 0.3)) // Rough gzip estimate
        });
        
        analysis.totalSize += size;
        analysis.gzippedEstimate += Math.round(size * 0.3);
      }
    });
  }

  if (fs.existsSync(distPath)) {
    readDirectory(distPath);
    
    // Sort by size descending
    analysis.assets.sort((a, b) => b.sizeBytes - a.sizeBytes);
    
    // Save analysis
    const analysisPath = path.join(distPath, 'bundle-analysis.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    
    console.log(`📦 Bundle Analysis:`);
    console.log(`   Total assets: ${analysis.assets.length}`);
    console.log(`   Total size: ${formatBytes(analysis.totalSize)}`);
    console.log(`   Estimated gzipped: ${formatBytes(analysis.gzippedEstimate)}`);
    console.log(`   Analysis saved: ${analysisPath}`);
    
    // Show largest files
    console.log(`📈 Largest assets:`);
    analysis.assets.slice(0, 5).forEach((asset, i) => {
      console.log(`   ${i + 1}. ${asset.name} - ${asset.size}`);
    });
  } else {
    console.log('❌ Dist folder not found. Run build first.');
  }
}

// Performance budget check
function checkPerformanceBudget() {
  console.log('⚡ Checking performance budget...');
  
  const budget = {
    maxTotalSize: 2 * 1024 * 1024, // 2MB
    maxJSSize: 500 * 1024, // 500KB
    maxCSSSize: 100 * 1024, // 100KB
    maxImageSize: 1 * 1024 * 1024 // 1MB
  };

  const distPath = paths.build;
  const results = {
    js: 0,
    css: 0,
    images: 0,
    total: 0,
    violations: []
  };

  function analyzeFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        analyzeFiles(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        const size = stats.size;
        results.total += size;
        
        if (ext === '.js') {
          results.js += size;
        } else if (ext === '.css') {
          results.css += size;
        } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
          results.images += size;
        }
      }
    });
  }

  if (fs.existsSync(distPath)) {
    analyzeFiles(distPath);
    
    // Check budget violations
    if (results.total > budget.maxTotalSize) {
      results.violations.push(`Total size ${formatBytes(results.total)} exceeds budget ${formatBytes(budget.maxTotalSize)}`);
    }
    if (results.js > budget.maxJSSize) {
      results.violations.push(`JS size ${formatBytes(results.js)} exceeds budget ${formatBytes(budget.maxJSSize)}`);
    }
    if (results.css > budget.maxCSSSize) {
      results.violations.push(`CSS size ${formatBytes(results.css)} exceeds budget ${formatBytes(budget.maxCSSSize)}`);
    }
    if (results.images > budget.maxImageSize) {
      results.violations.push(`Images size ${formatBytes(results.images)} exceeds budget ${formatBytes(budget.maxImageSize)}`);
    }

    console.log(`💰 Performance Budget Results:`);
    console.log(`   JS: ${formatBytes(results.js)} / ${formatBytes(budget.maxJSSize)}`);
    console.log(`   CSS: ${formatBytes(results.css)} / ${formatBytes(budget.maxCSSSize)}`);
    console.log(`   Images: ${formatBytes(results.images)} / ${formatBytes(budget.maxImageSize)}`);
    console.log(`   Total: ${formatBytes(results.total)} / ${formatBytes(budget.maxTotalSize)}`);
    
    if (results.violations.length > 0) {
      console.log(`❌ Budget violations:`);
      results.violations.forEach(violation => {
        console.log(`   - ${violation}`);
      });
      process.exit(1);
    } else {
      console.log(`✅ All budget checks passed!`);
    }
  }
}

// Helper functions
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getAssetType(ext) {
  const types = {
    '.js': 'JavaScript',
    '.css': 'CSS',
    '.html': 'HTML',
    '.jpg': 'Image',
    '.jpeg': 'Image',
    '.png': 'Image',
    '.gif': 'Image',
    '.svg': 'Image',
    '.webp': 'Image',
    '.woff': 'Font',
    '.woff2': 'Font',
    '.ttf': 'Font',
    '.eot': 'Font'
  };
  return types[ext.toLowerCase()] || 'Other';
}

// Define tasks
gulp.task('optimize:images', optimizeImages);
gulp.task('optimize:css', optimizeCSS);
gulp.task('optimize:js', optimizeJS);
gulp.task('analyze', analyzeBundles);
gulp.task('budget', checkPerformanceBudget);

// Combined optimization task
gulp.task('optimize', gulp.parallel('optimize:images', 'optimize:css', 'optimize:js'));

// Full analysis task
gulp.task('analyze:full', gulp.series('analyze', 'budget'));

// Default task
gulp.task('default', gulp.series('optimize', 'analyze:full'));

// Export tasks
exports.optimizeImages = optimizeImages;
exports.optimizeCSS = optimizeCSS;
exports.optimizeJS = optimizeJS;
exports.analyze = analyzeBundles;
exports.budget = checkPerformanceBudget;
exports.optimize = gulp.parallel('optimize:images', 'optimize:css', 'optimize:js');
exports.default = gulp.series('optimize', 'analyze:full');