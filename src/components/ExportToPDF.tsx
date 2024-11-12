import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  table: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    backgroundColor: '#f2f2f2',
  },
  tableCol: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export interface ITableConfig {
  headers: string[];
  dataKeys: string[];
}

interface IExportToPDFProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  tableConfig: ITableConfig;
}

const ExportToPDF: React.FC<IExportToPDFProps> = ({
  title,
  data,
  tableConfig,
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          {tableConfig.headers.map((header, index) => (
            <View style={styles.tableColHeader} key={index}>
              <Text style={styles.tableCellHeader}>{header}</Text>
            </View>
          ))}
        </View>

        {data.map((row, rowIndex) => (
          <View style={styles.tableRow} key={rowIndex}>
            {tableConfig.dataKeys.map((key, colIndex) => (
              <View style={styles.tableCol} key={colIndex}>
                <Text style={styles.tableCell}>{row[key]}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </Page>
  </Document>
);

export default ExportToPDF;
