"use client";

import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

// --- Types ---
type SupplierItem = {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
};

type Supplier = {
  id: string;
  name: string;
  bankName?: string;
  shortName?: string;
  paymentTerm?: string;
  creditLimit?: string;
  accountNumber?: string;
  phone?: string;
  blacklisted?: string;
  email?: string;
  kra?: string;
  preferredPaymentMethod?: string;
  website?: string;
  code?: string;
};

type DeliveryDetail = {
  deliverTo?: string;
  reqDate: string;
  dueDate?: string;
  code?: string;
  isUrgent?: boolean;
  prepay?: boolean;
  offload?: boolean;
  isDelivered?: boolean;
};

type SupplierReq = {
  id: string;
  reqId: string;
  contactPhone: string;
  contactEmail: string;
  shipping: number;
  subtotal: number;
  grandTotal: number;
  status: string;
  remarks: string;
  requisitionItems: SupplierItem[];
  supplier: Supplier | null;
  delivery: DeliveryDetail | null;
};

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
    textAlign: "left",
    color: "purple",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
    color: "brown",
  },
  label: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  wear: {
    fontSize: 10,
    fontWeight: "light",
    color: "brown",
  },
  supplierHead: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
    color: "purple",
  },
  supplier: {
    fontSize: 10,
    fontWeight: "light",
    color: "black",
  },
  supplierlabel: {
    fontSize: 10,
    fontWeight: "light",
    color: "#444444",
  },
  itemTableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    marginTop: 10,
  },
  itemTableRow: {
    flexDirection: "row",
    borderBottom: "0.5px solid #ddd",
    paddingVertical: 2,
  },
  itemCol: {
    fontSize: 9,
    paddingHorizontal: 2,
    wordBreak: "break-word",
  },
  colName: { width: "30%" },
  colQty: { width: "10%", textAlign: "center" },
  colUnit: { width: "15%", textAlign: "center" },
  colDisc: { width: "10%", textAlign: "center" },
  colTax: { width: "10%", textAlign: "center" },
  colTotal: { width: "15%", textAlign: "right" },
});

const SupplierReqPDF = () => {
  const [reqData, setReqData] = useState<SupplierReq | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("SupplierReqData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const withItemsKeyFixed = {
          ...parsed,
          requisitionItems: parsed.requisitionItems ?? parsed.items ?? [],
        };
        setReqData(withItemsKeyFixed);
      } catch (error) {
        console.error("Error parsing SupplierReqData:", error);
      }
    }
  }, []);

  return (
    <PDFViewer width="100%" height="550">
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.subtitle}>Purchase Order Entry</Text>
          <Text style={styles.title}>
            MWAKA <Text style={{ color: "orange" }}>WEAR</Text>
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: "1px solid red",
            }}
          >
            <View>
              <Text style={styles.wear}>
                Invoice Number:{" "}
                <Text style={{ color: "green", fontSize: 8 }}>
                  {reqData?.reqId}
                </Text>
              </Text>
              <Text style={styles.wear}>
                Date:{" "}
                <Text style={{ color: "green", fontSize: 8 }}>
                  {new Date().toLocaleString()}
                </Text>
              </Text>
            </View>
            <View>
              <Text style={styles.wear}>Nakuru, Kenya</Text>
              <Text style={styles.wear}>Code: 00100</Text>
              <Text style={styles.wear}>Phone: +254 70000000000</Text>
              <Text style={styles.wear}>www.mwakawear.com</Text>
            </View>
          </View>

          <Text style={styles.supplierHead}>Supplier Details</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: "1px solid green",
            }}
          >
            <View>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Name:</Text>{" "}
                {reqData?.supplier?.name}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Short Name:</Text>{" "}
                {reqData?.supplier?.shortName}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Code:</Text>{" "}
                {reqData?.supplier?.code}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Bank Name:</Text>{" "}
                {reqData?.supplier?.bankName}
              </Text>
            </View>
            <View>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>ID Number:</Text>{" "}
                {reqData?.supplier?.id}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Phone:</Text>{" "}
                {reqData?.supplier?.phone}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Email:</Text>{" "}
                {reqData?.supplier?.email}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>KRA Pin:</Text>{" "}
                {reqData?.supplier?.kra}
              </Text>
            </View>
            <View>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Preferred Payment:</Text>{" "}
                {reqData?.supplier?.preferredPaymentMethod}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Website:</Text>{" "}
                {reqData?.supplier?.website}
              </Text>
              <Text style={styles.supplierlabel}>
                <Text style={styles.supplier}>Credit Limit:</Text>{" "}
                {reqData?.supplier?.creditLimit}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: "1px solid blue",
            }}
          >
            <Text style={styles.supplierlabel}>
              <Text style={styles.supplier}>Deliver To:</Text>{" "}
              {reqData?.delivery?.deliverTo} Branch
            </Text>
            <Text style={styles.supplierlabel}>
              <Text style={styles.supplier}>Due Date:</Text>{" "}
              {reqData?.delivery?.dueDate}
            </Text>
            <Text style={styles.supplierlabel}>
              <Text style={styles.supplier}>Request Date:</Text>{" "}
              {reqData?.delivery?.reqDate}
            </Text>
            <Text style={styles.supplierlabel}>
              <Text style={styles.supplier}>Urgent:</Text>{" "}
              {reqData?.delivery?.isUrgent ? "Yes" : "No"}
            </Text>
            <Text style={styles.supplierlabel}>
              <Text style={styles.supplier}>Prepay:</Text>{" "}
              {reqData?.delivery?.prepay ? "Yes" : "No"}
            </Text>
            <Text style={styles.supplierlabel}>
              <Text style={styles.supplier}>Offload:</Text>{" "}
              {reqData?.delivery?.offload ? "Yes" : "No"}
            </Text>
            <Text style={styles.supplierlabel}>
              <Text style={styles.supplier}>Delivered:</Text>{" "}
              {reqData?.delivery?.isDelivered ? "Yes" : "No"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.supplierlabel}>Remarks</Text>
            <Text style={styles.supplier}>
              {reqData?.remarks || "No remarks for this particular order!"}
            </Text>
          </View>

          {/* Item Table Header */}
          <View style={styles.itemTableHeader}>
            <Text style={[styles.itemCol, styles.colName]}>Item Name</Text>
            <Text style={[styles.itemCol, styles.colQty]}>Qty</Text>
            <Text style={[styles.itemCol, styles.colUnit]}>Unit Price</Text>
            <Text style={[styles.itemCol, styles.colDisc]}>Disc</Text>
            <Text style={[styles.itemCol, styles.colTax]}>Tax</Text>
            <Text style={[styles.itemCol, styles.colTotal]}>Total</Text>
          </View>

          {/* Item Table Rows */}
          {reqData?.requisitionItems.map((item, index) => (
            <View key={index} style={styles.itemTableRow}>
              <Text style={[styles.itemCol, styles.colName]}>
                {item.itemName}
              </Text>
              <Text style={[styles.itemCol, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.itemCol, styles.colUnit]}>
                {item.unitPrice}
              </Text>
              <Text style={[styles.itemCol, styles.colDisc]}>
                {item.discount}
              </Text>
              <Text style={[styles.itemCol, styles.colTax]}>{item.tax}</Text>
              <Text style={[styles.itemCol, styles.colTotal]}>
                {item.total}
              </Text>
            </View>
          ))}

          {/* Totals */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 15,
              alignItems: "flex-end",
            }}
          >
            <Text style={{ fontSize: 10, color: "green" }}>
              Shipping Fee:{" "}
              <Text style={{ fontSize: 10, color: "brown" }}>
                {reqData?.shipping}
              </Text>
            </Text>
            <Text style={{ fontSize: 10, color: "green" }}>
              Subtotal Amount:{" "}
              <Text style={{ fontSize: 10, color: "brown" }}>
                {reqData?.subtotal}
              </Text>
            </Text>
            <Text style={{ fontSize: 10, color: "green" }}>
              Grand Total:{" "}
              <Text style={{ fontSize: 10, color: "brown" }}>
                {reqData?.grandTotal}
              </Text>
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default SupplierReqPDF;