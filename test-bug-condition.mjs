/**
 * Bug Condition Exploration Test
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12, 1.13, 1.14, 1.15, 1.16**
 * 
 * Property 1: Bug Condition - Build Failure with Bundle Size and TypeScript Errors
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * This test validates that the bug condition exists by checking:
 * - Build fails OR main bundle exceeds 2MB
 * - TypeScript has compilation errors
 * - Duplicate identifiers exist
 * - Missing type exports
 * - Missing interface properties
 * - CSS import order violations
 * - Missing configuration entries
 * 
 * Expected Behavior Properties (what SHOULD be true after fix):
 * - Build should complete successfully (exit code 0)
 * - All chunks should be under 500KB
 * - TypeScript errors should be 0
 * - No duplicate identifiers
 * - All types properly exported
 * - All interface properties defined
 * - CSS imports at top of file
 * - Complete configuration for all business categories
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Test results accumulator
const results = {
  buildSuccess: false,
  buildExitCode: null,
  mainBundleSize: 0,
  allChunksUnder500KB: true,
  largestChunks: [],
  typeScriptErrors: 0,
  hasDuplicateIdentifiers: false,
  duplicateIdentifiers: [],
  hasMissingTypeExports: false,
  missingTypeExports: [],
  hasMissingProperties: false,
  missingProperties: [],
  cssImportOrderWrong: false,
  hasIncompleteConfig: false,
  missingConfigEntries: [],
  hasUnusedImports: false,
  unusedImportCount: 0,
  hasImplicitAnyTypes: false,
  implicitAnyCount: 0
};

console.log('='.repeat(80));
console.log('Bug Condition Exploration Test');
console.log('Property 1: Bug Condition - Build Failure with Bundle Size and TypeScript Errors');
console.log('='.repeat(80));
console.log('');

// Test 1: Run npm run build and capture exit code
console.log('Test 1: Running npm run build...');
try {
  execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
  results.buildSuccess = true;
  results.buildExitCode = 0;
  console.log('✓ Build completed successfully (exit code 0)');
} catch (error) {
  results.buildSuccess = false;
  results.buildExitCode = error.status || 1;
  console.log(`✗ Build failed (exit code ${results.buildExitCode})`);
  console.log(`  Error: ${error.message}`);
}
console.log('');

// Test 2: Check bundle sizes in dist/assets/
console.log('Test 2: Analyzing bundle sizes...');
try {
  const distAssetsPath = './dist/assets';
  const files = readdirSync(distAssetsPath);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  let totalSize = 0;
  const chunks = [];
  
  for (const file of jsFiles) {
    const filePath = join(distAssetsPath, file);
    const stats = statSync(filePath);
    const sizeKB = stats.size / 1024;
    const sizeMB = stats.size / (1024 * 1024);
    
    chunks.push({ file, size: stats.size, sizeKB, sizeMB });
    totalSize += stats.size;
    
    if (stats.size > 500 * 1024) {
      results.allChunksUnder500KB = false;
    }
  }
  
  // Sort by size descending
  chunks.sort((a, b) => b.size - a.size);
  results.largestChunks = chunks.slice(0, 5);
  results.mainBundleSize = chunks[0]?.size || 0;
  
  console.log(`  Total JS size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`  Largest chunk: ${chunks[0]?.file} - ${chunks[0]?.sizeMB.toFixed(2)} MB`);
  console.log('  Top 5 chunks:');
  for (const chunk of results.largestChunks) {
    const status = chunk.sizeKB > 500 ? '✗' : '✓';
    console.log(`    ${status} ${chunk.file}: ${chunk.sizeKB.toFixed(2)} KB`);
  }
  
  if (results.mainBundleSize > 2 * 1024 * 1024) {
    console.log(`✗ Main bundle exceeds 2MB: ${(results.mainBundleSize / (1024 * 1024)).toFixed(2)} MB`);
  } else if (!results.allChunksUnder500KB) {
    console.log('✗ Some chunks exceed 500KB');
  } else {
    console.log('✓ All chunks under 500KB');
  }
} catch (error) {
  console.log(`  Warning: Could not analyze bundle sizes: ${error.message}`);
}
console.log('');

// Test 3: Run tsc --noEmit and capture TypeScript error count
console.log('Test 3: Running TypeScript compiler...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe', encoding: 'utf-8' });
  results.typeScriptErrors = 0;
  console.log('✓ TypeScript compilation successful (0 errors)');
} catch (error) {
  const output = error.stdout || error.stderr || '';
  // Count error lines (lines that start with file paths and contain "error TS")
  const errorLines = output.split('\n').filter(line => line.includes('error TS'));
  results.typeScriptErrors = errorLines.length;
  console.log(`✗ TypeScript compilation failed (${results.typeScriptErrors} errors)`);
  
  // Show first 10 errors
  console.log('  First 10 errors:');
  errorLines.slice(0, 10).forEach(line => {
    console.log(`    ${line.trim()}`);
  });
  if (errorLines.length > 10) {
    console.log(`    ... and ${errorLines.length - 10} more errors`);
  }
}
console.log('');

// Test 4: Check for duplicate identifiers in App.tsx
console.log('Test 4: Checking for duplicate identifiers in App.tsx...');
try {
  const appTsx = readFileSync('./src/App.tsx', 'utf-8');
  const lines = appTsx.split('\n');
  
  // Check for TimeDilationChamber
  const timeDilationLines = [];
  const tachyonLines = [];
  
  lines.forEach((line, index) => {
    if (line.includes('TimeDilationChamber') && line.includes('import')) {
      timeDilationLines.push(index + 1);
    }
    if (line.includes('TachyonSensorGridMfg') && line.includes('import')) {
      tachyonLines.push(index + 1);
    }
  });
  
  if (timeDilationLines.length > 1) {
    results.hasDuplicateIdentifiers = true;
    results.duplicateIdentifiers.push(`TimeDilationChamber (lines: ${timeDilationLines.join(', ')})`);
    console.log(`✗ Duplicate identifier: TimeDilationChamber at lines ${timeDilationLines.join(', ')}`);
  }
  
  if (tachyonLines.length > 1) {
    results.hasDuplicateIdentifiers = true;
    results.duplicateIdentifiers.push(`TachyonSensorGridMfg (lines: ${tachyonLines.join(', ')})`);
    console.log(`✗ Duplicate identifier: TachyonSensorGridMfg at lines ${tachyonLines.join(', ')}`);
  }
  
  if (!results.hasDuplicateIdentifiers) {
    console.log('✓ No duplicate identifiers found');
  }
} catch (error) {
  console.log(`  Warning: Could not check App.tsx: ${error.message}`);
}
console.log('');

// Test 5: Check for missing type exports in AppContext.tsx
console.log('Test 5: Checking for missing type exports...');
try {
  const appContext = readFileSync('./src/store/AppContext.tsx', 'utf-8');
  
  // Check if MeasurementsRecord is defined but not exported
  if (appContext.includes('MeasurementsRecord') && !appContext.includes('export interface MeasurementsRecord') && !appContext.includes('export type MeasurementsRecord')) {
    results.hasMissingTypeExports = true;
    results.missingTypeExports.push('MeasurementsRecord');
    console.log('✗ Missing export: MeasurementsRecord');
  }
  
  // Check if GeneticArkReplicator is defined but not exported
  if (appContext.includes('GeneticArkReplicator') && !appContext.includes('export interface GeneticArkReplicator') && !appContext.includes('export type GeneticArkReplicator')) {
    results.hasMissingTypeExports = true;
    results.missingTypeExports.push('GeneticArkReplicator');
    console.log('✗ Missing export: GeneticArkReplicator');
  }
  
  if (!results.hasMissingTypeExports) {
    console.log('✓ All required types exported');
  }
} catch (error) {
  console.log(`  Warning: Could not check AppContext.tsx: ${error.message}`);
}
console.log('');

// Test 6: Check for missing properties in BusinessProfile interface
console.log('Test 6: Checking for missing interface properties...');
try {
  const appContext = readFileSync('./src/store/AppContext.tsx', 'utf-8');
  
  // Check BusinessProfile interface
  const businessProfileMatch = appContext.match(/interface BusinessProfile\s*{[^}]+}/s);
  if (businessProfileMatch) {
    const interfaceContent = businessProfileMatch[0];
    
    if (!interfaceContent.includes('appointments')) {
      results.hasMissingProperties = true;
      results.missingProperties.push('BusinessProfile.appointments');
      console.log('✗ Missing property: BusinessProfile.appointments');
    }
    
    if (!interfaceContent.includes('staff')) {
      results.hasMissingProperties = true;
      results.missingProperties.push('BusinessProfile.staff');
      console.log('✗ Missing property: BusinessProfile.staff');
    }
    
    if (!interfaceContent.includes('services')) {
      results.hasMissingProperties = true;
      results.missingProperties.push('BusinessProfile.services');
      console.log('✗ Missing property: BusinessProfile.services');
    }
  }
  
  // Check InventoryItem interface
  const inventoryItemMatch = appContext.match(/interface InventoryItem\s*{[^}]+}/s);
  if (inventoryItemMatch) {
    const interfaceContent = inventoryItemMatch[0];
    
    if (!interfaceContent.includes('stockLevel')) {
      results.hasMissingProperties = true;
      results.missingProperties.push('InventoryItem.stockLevel');
      console.log('✗ Missing property: InventoryItem.stockLevel');
    }
    
    if (!interfaceContent.includes('averageCost')) {
      results.hasMissingProperties = true;
      results.missingProperties.push('InventoryItem.averageCost');
      console.log('✗ Missing property: InventoryItem.averageCost');
    }
  }
  
  if (!results.hasMissingProperties) {
    console.log('✓ All interface properties defined');
  }
} catch (error) {
  console.log(`  Warning: Could not check interface properties: ${error.message}`);
}
console.log('');

// Test 7: Check CSS import order in index.css
console.log('Test 7: Checking CSS import order...');
try {
  const indexCss = readFileSync('./src/index.css', 'utf-8');
  const lines = indexCss.split('\n');
  
  let firstNonImportLine = -1;
  let lastImportLine = -1;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('@import')) {
      lastImportLine = index;
    } else if (trimmed && !trimmed.startsWith('/*') && !trimmed.startsWith('*') && !trimmed.startsWith('//') && firstNonImportLine === -1) {
      firstNonImportLine = index;
    }
  });
  
  if (lastImportLine > firstNonImportLine && firstNonImportLine !== -1) {
    results.cssImportOrderWrong = true;
    console.log(`✗ CSS @import rules not at top (last @import at line ${lastImportLine + 1}, first non-import at line ${firstNonImportLine + 1})`);
  } else {
    console.log('✓ CSS @import rules at top of file');
  }
} catch (error) {
  console.log(`  Warning: Could not check index.css: ${error.message}`);
}
console.log('');

// Test 8: Check for missing event_planner configuration
console.log('Test 8: Checking for missing configuration entries...');
try {
  // Check businessTools.ts
  const businessTools = readFileSync('./src/config/businessTools.ts', 'utf-8');
  if (!businessTools.includes('event_planner')) {
    results.hasIncompleteConfig = true;
    results.missingConfigEntries.push('businessTools.ts: event_planner');
    console.log('✗ Missing configuration: businessTools.ts - event_planner');
  }
  
  // Check categoryThemes.ts
  const categoryThemes = readFileSync('./src/config/categoryThemes.ts', 'utf-8');
  if (!categoryThemes.includes('event_planner')) {
    results.hasIncompleteConfig = true;
    results.missingConfigEntries.push('categoryThemes.ts: event_planner');
    console.log('✗ Missing configuration: categoryThemes.ts - event_planner');
  }
  
  // Check designTokens.ts
  const designTokens = readFileSync('./src/config/designTokens.ts', 'utf-8');
  if (!designTokens.includes('event_planner')) {
    results.hasIncompleteConfig = true;
    results.missingConfigEntries.push('designTokens.ts: event_planner');
    console.log('✗ Missing configuration: designTokens.ts - event_planner');
  }
  
  if (!results.hasIncompleteConfig) {
    console.log('✓ Complete configuration for all business categories');
  }
} catch (error) {
  console.log(`  Warning: Could not check configuration files: ${error.message}`);
}
console.log('');

// Summary
console.log('='.repeat(80));
console.log('Test Summary');
console.log('='.repeat(80));
console.log('');

console.log('Bug Condition Checks (should FAIL on unfixed code):');
console.log(`  Build Success: ${results.buildSuccess ? '✓ PASS' : '✗ FAIL'} (exit code: ${results.buildExitCode})`);
console.log(`  Bundle Size: ${results.mainBundleSize <= 2 * 1024 * 1024 && results.allChunksUnder500KB ? '✓ PASS' : '✗ FAIL'} (main: ${(results.mainBundleSize / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`  TypeScript Errors: ${results.typeScriptErrors === 0 ? '✓ PASS' : '✗ FAIL'} (${results.typeScriptErrors} errors)`);
console.log(`  Duplicate Identifiers: ${!results.hasDuplicateIdentifiers ? '✓ PASS' : '✗ FAIL'} (${results.duplicateIdentifiers.length} found)`);
console.log(`  Type Exports: ${!results.hasMissingTypeExports ? '✓ PASS' : '✗ FAIL'} (${results.missingTypeExports.length} missing)`);
console.log(`  Interface Properties: ${!results.hasMissingProperties ? '✓ PASS' : '✗ FAIL'} (${results.missingProperties.length} missing)`);
console.log(`  CSS Import Order: ${!results.cssImportOrderWrong ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Configuration Complete: ${!results.hasIncompleteConfig ? '✓ PASS' : '✗ FAIL'} (${results.missingConfigEntries.length} missing)`);
console.log('');

// Calculate bug condition
const bugConditionMet = 
  !results.buildSuccess ||
  results.mainBundleSize > 2 * 1024 * 1024 ||
  !results.allChunksUnder500KB ||
  results.typeScriptErrors > 0 ||
  results.hasDuplicateIdentifiers ||
  results.hasMissingTypeExports ||
  results.hasMissingProperties ||
  results.cssImportOrderWrong ||
  results.hasIncompleteConfig;

console.log('Overall Result:');
if (bugConditionMet) {
  console.log('✗ BUG CONDITION MET - Test correctly identifies the bug exists');
  console.log('  This is the EXPECTED outcome for unfixed code');
  console.log('');
  console.log('Counterexamples Found:');
  if (!results.buildSuccess) {
    console.log(`  - Build failed with exit code ${results.buildExitCode}`);
  }
  if (results.mainBundleSize > 2 * 1024 * 1024) {
    console.log(`  - Main bundle size: ${(results.mainBundleSize / (1024 * 1024)).toFixed(2)} MB (exceeds 2MB limit)`);
  }
  if (!results.allChunksUnder500KB) {
    console.log(`  - ${results.largestChunks.filter(c => c.sizeKB > 500).length} chunks exceed 500KB`);
  }
  if (results.typeScriptErrors > 0) {
    console.log(`  - TypeScript errors: ${results.typeScriptErrors}`);
  }
  if (results.duplicateIdentifiers.length > 0) {
    console.log(`  - Duplicate identifiers: ${results.duplicateIdentifiers.join(', ')}`);
  }
  if (results.missingTypeExports.length > 0) {
    console.log(`  - Missing type exports: ${results.missingTypeExports.join(', ')}`);
  }
  if (results.missingProperties.length > 0) {
    console.log(`  - Missing properties: ${results.missingProperties.join(', ')}`);
  }
  if (results.cssImportOrderWrong) {
    console.log(`  - CSS @import rules not at top of file`);
  }
  if (results.missingConfigEntries.length > 0) {
    console.log(`  - Missing configuration: ${results.missingConfigEntries.join(', ')}`);
  }
  process.exit(1); // Exit with error code to indicate bug exists
} else {
  console.log('✓ ALL CHECKS PASSED - Bug has been fixed');
  console.log('  This is the EXPECTED outcome for fixed code');
  process.exit(0); // Exit successfully
}
