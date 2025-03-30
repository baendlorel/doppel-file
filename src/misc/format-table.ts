export const formatRightAlignedTable = (table: (string | number)[][]): string => {
  // 将所有元素转换为字符串
  const stringTable = table.map((row) => row.map((cell) => String(cell)));

  // 计算每列的最大宽度
  const colWidths = stringTable[0].map((_, colIndex) =>
    Math.max(...stringTable.map((row) => row[colIndex].length))
  );

  // 构建格式化后的表格字符串
  return stringTable
    .map((row) =>
      row.map((cell, colIndex) => cell.padStart(colWidths[colIndex])).join(' | ')
    )
    .join('\n');
};

export const formatTable = (data: any[][]): string => {
  if (data.length === 0) {
    return '';
  }

  // 将所有元素转换为字符串
  data = data.map((row) => row.map((cell) => String(cell)));

  // 计算每列的最大宽度
  const colWidths = data[0].map((_, colIndex) =>
    Math.max(...data.map((row) => row[colIndex]?.length || 0))
  );

  const horizontalLine = (left: string, mid: string, right: string, fill: string) =>
    left + colWidths.map((w) => fill.repeat(w + 2)).join(mid) + right;

  const topBorder = horizontalLine('┌', '┬', '┐', '─');
  const middleBorder = horizontalLine('├', '┼', '┤', '─');
  const bottomBorder = horizontalLine('└', '┴', '┘', '─');

  const formattedRows = [] as string[];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    formattedRows.push(
      middleBorder,
      '│ ' + row.map((cell, i) => cell.padEnd(colWidths[i])).join(' │ ') + ' │'
    );
  }
  formattedRows.shift();

  return [
    topBorder,
    ...formattedRows, // 表体
    bottomBorder,
  ].join('\n');
};
