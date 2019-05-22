function jsonToCSV(data) {
  if (!data || !data.length) {
    return null;
  }

  const csvRows = [];

  // get the headers
  const originalHeaders = Object.keys(data[0]);
  let index = originalHeaders.indexOf('id');
  if (index > -1) {
    originalHeaders.splice(index, 1);
  }
  index = originalHeaders.indexOf('visitor_id');
  if (index > -1) {
    originalHeaders.splice(index, 1);
  }

  let renamedHeaders = originalHeaders.map(header => {
    switch (header) {
      case 'check_in':
        return 'Check In';
      case 'visitor__visitor_id':
        return 'Visitor ID';
      case 'check_out':
        return 'Check Out';
      case 'visitor__visitor_id':
        return 'Visitor ID';
      case 'visitor__first_name':
        return 'First Name';
      case 'visitor__last_name':
        return 'Last Name';
      case 'visitor__is_employee':
        return 'Is Employee';
      case 'visitor__waiver_signed':
        return 'Is Waiver Signed';
      case 'reasons':
        return 'Visit Reasons';
      default:
        return header;
    }
  });
  csvRows.push(renamedHeaders.join(','));

  // loop over the rows
  for (const row of data) {
    const values = originalHeaders.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export default jsonToCSV;
