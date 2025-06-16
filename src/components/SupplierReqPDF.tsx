import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign:"center",
    color:"red"
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
});

const SupplierReqPDF = () => {
if (typeof window === "undefined") return null;

const storedData = localStorage.getItem("SupplierReqData");
const reqData = storedData ? JSON.parse(storedData) : null;
if (!reqData) return <div>No data found</div>;

  const {
    id,
    createdAt,
    updatedAt,
    grandTotal,
    remarks,
    shipping,
    status,
    subtotal,
    supplier,
    purchaseAdditionalInfo,
  } = reqData;

  return (
    <PDFViewer width="100%" height="550">
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Supplier Requisition Entry</Text>

          <View style={styles.section}>
            <Text style={styles.subtitle}>General Info</Text>
            <Text><Text style={styles.label}>Requisition ID:</Text> {id}</Text>
            <Text><Text style={styles.label}>Status:</Text> {status}</Text>
            <Text><Text style={styles.label}>Created At:</Text> {new Date(createdAt).toLocaleString()}</Text>
            <Text><Text style={styles.label}>Updated At:</Text> {new Date(updatedAt).toLocaleString()}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Supplier Info</Text>
            <Text><Text style={styles.label}>Name:</Text> {supplier?.name}</Text>
            <Text><Text style={styles.label}>Short Name:</Text> {supplier?.shortName}</Text>
            <Text><Text style={styles.label}>Code:</Text> {supplier?.code}</Text>
            <Text><Text style={styles.label}>Bank Name:</Text> {supplier?.bankName}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Financials</Text>
            <Text><Text style={styles.label}>Subtotal:</Text> {subtotal}</Text>
            <Text><Text style={styles.label}>Shipping:</Text> {shipping}</Text>
            <Text><Text style={styles.label}>Grand Total:</Text> {grandTotal}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Additional Info</Text>
            <Text><Text style={styles.label}>Deliver To:</Text> {purchaseAdditionalInfo?.deliverTo}</Text>
            <Text><Text style={styles.label}>Due Date:</Text> {purchaseAdditionalInfo?.dueDate}</Text>
            <Text><Text style={styles.label}>Request Date:</Text> {purchaseAdditionalInfo?.reqDate}</Text>
            <Text><Text style={styles.label}>Urgent:</Text> {purchaseAdditionalInfo?.isUrgent ? "Yes" : "No"}</Text>
            <Text><Text style={styles.label}>Prepay:</Text> {purchaseAdditionalInfo?.prepay ? "Yes" : "No"}</Text>
            <Text><Text style={styles.label}>Offload:</Text> {purchaseAdditionalInfo?.offload ? "Yes" : "No"}</Text>
            <Text><Text style={styles.label}>Delivered:</Text> {purchaseAdditionalInfo?.isDelivered ? "Yes" : "No"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>Remarks</Text>
            <Text>{remarks || "None"}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default SupplierReqPDF;
