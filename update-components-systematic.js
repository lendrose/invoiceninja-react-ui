const fs = require('fs');
const path = require('path');

// Helper function to get component name from file path
function getComponentNameFromPath(filePath) {
  const fileName = path.basename(filePath, '.tsx');
  return fileName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Function to update a single file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has the import
    if (content.includes('getComponentAttributes')) {
      console.log(`Skipping ${filePath} - already has getComponentAttributes import`);
      return;
    }
    
    // Check if it's a React component file
    if (!content.includes('export default function') && !content.includes('export function')) {
      console.log(`Skipping ${filePath} - not a React component`);
      return;
    }
    
    const componentName = getComponentNameFromPath(filePath);
    
    // Add import
    const importStatement = `import { getComponentAttributes } from '$app/common/helpers/componentAttributes';`;
    
    // Find the last import statement
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    if (importLines.length === 0) {
      console.log(`Skipping ${filePath} - no import statements found`);
      return;
    }
    
    const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
    const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
    
    content = content.slice(0, insertIndex) + importStatement + '\n' + content.slice(insertIndex);
    
    // Find the return statement
    const returnMatch = content.match(/(\s+)return\s*\(/);
    if (!returnMatch) {
      console.log(`Skipping ${filePath} - no return statement found`);
      return;
    }
    
    const returnStart = returnMatch.index;
    const indent = returnMatch[1];
    
    // Find the content after the return statement
    const returnContentStart = returnStart + returnMatch[0].length;
    
    // Look for the first JSX element after return
    const jsxMatch = content.slice(returnContentStart).match(/^\s*<([A-Z][a-zA-Z0-9]*)/);
    
    if (jsxMatch) {
      // Component returns a single component (like <Default>, <DataTable>, etc.)
      const componentName = jsxMatch[1];
      const componentStart = returnContentStart + jsxMatch.index;
      const componentEnd = componentStart + jsxMatch[0].length;
      
      // Find the opening tag
      const tagMatch = content.slice(componentStart).match(/<([A-Z][a-zA-Z0-9]*)([^>]*)>/);
      if (tagMatch) {
        const tagStart = componentStart + tagMatch.index;
        const tagEnd = tagStart + tagMatch[0].length;
        const beforeTag = content.slice(0, tagStart);
        const tagContent = tagMatch[0];
        const afterTag = content.slice(tagEnd);
        
        // Add the data-component attribute
        const newTag = tagContent.replace('>', ` {...getComponentAttributes('${componentName}')}>`);
        const newContent = beforeTag + newTag + afterTag;
        
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath} with component name: ${componentName}`);
        return;
      }
    }
    
    // Look for JSX fragment or multiple elements
    const fragmentMatch = content.slice(returnContentStart).match(/^\s*<>/);
    if (fragmentMatch) {
      // JSX fragment - wrap in div
      const fragmentStart = returnContentStart + fragmentMatch.index;
      
      // Find the closing fragment
      let depth = 0;
      let i = fragmentStart;
      let endIndex = -1;
      
      while (i < content.length) {
        if (content[i] === '<' && content[i + 1] !== '/') depth++;
        if (content[i] === '<' && content[i + 1] === '/') depth--;
        if (content[i] === ')' && depth === 0) {
          endIndex = i;
          break;
        }
        i++;
      }
      
      if (endIndex !== -1) {
        const beforeFragment = content.slice(0, fragmentStart);
        const fragmentContent = content.slice(fragmentStart, endIndex);
        const afterFragment = content.slice(endIndex);
        
        const newFragment = `    <div {...getComponentAttributes('${componentName}')}>\n${fragmentContent.replace(/^\s+/, '      ')}\n    </div>`;
        
        const newContent = beforeFragment + newFragment + afterFragment;
        
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath} with wrapped fragment - component name: ${componentName}`);
        return;
      }
    }
    
    // Look for single HTML element
    const htmlMatch = content.slice(returnContentStart).match(/^\s*<([a-z][a-zA-Z0-9]*)/);
    if (htmlMatch) {
      const elementName = htmlMatch[1];
      const elementStart = returnContentStart + htmlMatch.index;
      const elementEnd = elementStart + htmlMatch[0].length;
      
      // Find the opening tag
      const tagMatch = content.slice(elementStart).match(/<([a-z][a-zA-Z0-9]*)([^>]*)>/);
      if (tagMatch) {
        const tagStart = elementStart + tagMatch.index;
        const tagEnd = tagStart + tagMatch[0].length;
        const beforeTag = content.slice(0, tagStart);
        const tagContent = tagMatch[0];
        const afterTag = content.slice(tagEnd);
        
        // Add the data-component attribute
        const newTag = tagContent.replace('>', ` {...getComponentAttributes('${componentName}')}>`);
        const newContent = beforeTag + newTag + afterTag;
        
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath} with HTML element - component name: ${componentName}`);
        return;
      }
    }
    
    console.log(`Skipping ${filePath} - could not determine return structure`);
    
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Function to recursively find all .tsx files
function findTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const tsxFiles = findTsxFiles(srcDir);

console.log(`Found ${tsxFiles.length} .tsx files`);

// Update each file
tsxFiles.forEach(updateFile);

console.log('Component update completed!');
