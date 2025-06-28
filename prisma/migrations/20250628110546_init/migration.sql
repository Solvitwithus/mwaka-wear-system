-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT NOT NULL,
    "description" TEXT DEFAULT 'No description',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT DEFAULT 'No description',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL DEFAULT false,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "file" TEXT,
    "chat" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "profileName" TEXT NOT NULL,
    "profileAbout" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "currencyName" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencyFormat" TEXT NOT NULL,
    "decimalPlaces" TEXT NOT NULL,
    "thousandSeparator" TEXT NOT NULL,
    "KSHtoUSDExchange" TEXT NOT NULL,
    "allowedforTransactions" BOOLEAN NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankName" (
    "id" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "BICCode" TEXT NOT NULL,
    "headOfficeAddress" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "addedBy" TEXT NOT NULL,
    "bankType" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankName_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salesperson" (
    "id" TEXT NOT NULL,
    "salesCode" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "region" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "idNumber" TEXT NOT NULL DEFAULT '',
    "salesArea" TEXT NOT NULL DEFAULT '',
    "salesType" TEXT NOT NULL DEFAULT '',
    "branchOffice" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "employmentType" TEXT NOT NULL DEFAULT '',
    "supervisor" TEXT NOT NULL DEFAULT '',
    "salesTarget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salesCommission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allowDiscount" BOOLEAN NOT NULL DEFAULT false,
    "addedBy" TEXT NOT NULL DEFAULT '',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Salesperson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "cycleDuration" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesArea" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "headquarters" TEXT NOT NULL,
    "areaManager" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTerm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalDuration" INTEGER NOT NULL,
    "numInstallments" INTEGER NOT NULL,
    "installments" JSONB NOT NULL,
    "startDateRule" TEXT NOT NULL,
    "gracePeriod" INTEGER NOT NULL,
    "lateFeeEnabled" BOOLEAN NOT NULL,
    "lateFeeType" TEXT NOT NULL,
    "lateFeeAmount" DOUBLE PRECISION NOT NULL,
    "lateFeeAfterDays" INTEGER NOT NULL,
    "earlyDiscountEnabled" BOOLEAN NOT NULL,
    "earlyDiscountPercent" DOUBLE PRECISION NOT NULL,
    "earlyDiscountWithinDays" INTEGER NOT NULL,
    "allowedMethods" TEXT NOT NULL,
    "applicableTo" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supportedTypes" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesCategory" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceAdjustmentType" TEXT NOT NULL,
    "priceAdjustment" DOUBLE PRECISION NOT NULL,
    "allowCredit" BOOLEAN NOT NULL,
    "creditLimit" DOUBLE PRECISION,
    "defaultPaymentTerm" TEXT,
    "applicableChannels" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "licenseIssueDate" TEXT,
    "dateOfBirth" TEXT,
    "address" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "yearOfManufacture" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "assignedBranch" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "initialOdometerReading" TEXT NOT NULL,
    "ownershipType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "shiftName" TEXT NOT NULL,
    "shiftCode" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "shiftActiveDate" TIMESTAMP(3) NOT NULL,
    "driver" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "transportationItem" TEXT NOT NULL,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,
    "wayPoint" TEXT,
    "isActive" TEXT NOT NULL,
    "comment" TEXT,
    "customStartLocation" TEXT,
    "customEndLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleCategory" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "maxLoad" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitOfMeasure" (
    "id" TEXT NOT NULL,
    "unitName" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT,
    "conversionFactor" DOUBLE PRECISION NOT NULL,
    "isBaseUnit" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitOfMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleGeneralLedgerAccount" (
    "id" TEXT NOT NULL,
    "glAccountCode" TEXT NOT NULL,
    "glAccountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "isPrimaryAccount" BOOLEAN NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "openingBalance" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverUserName" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleGeneralLedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "categoryCode" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "tags" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unitOfMeasure" TEXT NOT NULL,
    "description" TEXT,
    "excludeFromSale" BOOLEAN NOT NULL DEFAULT false,
    "excludeFromPurchase" BOOLEAN NOT NULL DEFAULT false,
    "branch" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "barcode" TEXT NOT NULL,
    "itemPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceBeforeTax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountWholesale" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountRetail" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customDiscountAllowed" BOOLEAN NOT NULL DEFAULT false,
    "taxType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "chargeType" TEXT NOT NULL,
    "lowerLimit" DOUBLE PRECISION NOT NULL,
    "upperLimit" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "fixedAmount" DOUBLE PRECISION NOT NULL,
    "reliefApplicable" BOOLEAN NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "branch" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerInitials" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "kraPin" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "salesPerson" TEXT NOT NULL,
    "discountEliginility" BOOLEAN NOT NULL,
    "branchName" TEXT NOT NULL,
    "salesArea" TEXT NOT NULL,
    "salesType" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "preferedPaymentMethod" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "allowedDiscount" TEXT NOT NULL,
    "creditLimit" TEXT NOT NULL,
    "paymentTerms" TEXT NOT NULL,
    "refNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "itemId" TEXT,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesQuotation" (
    "id" TEXT NOT NULL,
    "quotationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "deliveryDetailsId" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesQuotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryDetail" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "offload" BOOLEAN DEFAULT false,
    "prepay" BOOLEAN DEFAULT false,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "deliveryFrom" TEXT,
    "destination" TEXT,
    "customerReference" TEXT,
    "comment" TEXT,
    "phoneNumber" TEXT,
    "accompaniedBy" TEXT,

    CONSTRAINT "DeliveryDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectSale" (
    "id" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "deliveryDetailsId" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectSaleItem" (
    "id" TEXT NOT NULL,
    "directSaleId" TEXT NOT NULL,
    "itemId" TEXT,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectSaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditStatus" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "statusName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "defaultStatus" BOOLEAN NOT NULL DEFAULT false,
    "isFinalStatus" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountCode" TEXT,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountStatus" TEXT NOT NULL DEFAULT 'Active',
    "allowOverdraft" BOOLEAN NOT NULL DEFAULT false,
    "overdraftLimit" DOUBLE PRECISION,
    "isPrimaryAccount" BOOLEAN NOT NULL DEFAULT false,
    "usedForPayroll" BOOLEAN NOT NULL DEFAULT false,
    "branchCode" TEXT,
    "departmentName" TEXT,
    "currency" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "openingBalance" DOUBLE PRECISION NOT NULL,
    "reconciliationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesEntry" (
    "id" TEXT NOT NULL,
    "saleDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "deliveryDetailsId" TEXT NOT NULL,
    "salespersonId" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "shipping" DOUBLE PRECISION NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesEntryItem" (
    "id" TEXT NOT NULL,
    "salesEntryId" TEXT NOT NULL,
    "itemId" TEXT,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesEntryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "headOfDepartmentId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "establishedDate" TEXT NOT NULL,
    "budgetAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rank" (
    "id" TEXT NOT NULL,
    "rankName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT,
    "rankLevel" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignationTitle" (
    "id" TEXT NOT NULL,
    "titleName" TEXT NOT NULL,
    "titleCode" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "salary" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignationTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesGroup" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "groupType" TEXT NOT NULL,
    "description" TEXT,
    "defaultCommissionRate" DOUBLE PRECISION NOT NULL,
    "allowCustomCommission" BOOLEAN NOT NULL,
    "discountAllowed" DOUBLE PRECISION NOT NULL,
    "salesTarget" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleExpenseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "expenseAccount" TEXT NOT NULL,
    "tag" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "appliesToAllVehicles" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleExpenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrepaymentAllocation" (
    "id" TEXT NOT NULL,
    "salesEntryId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "allocateAll" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "partialAllocation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrepaymentAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "country" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "kra" TEXT NOT NULL,
    "vat" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankCode" TEXT,
    "accountNumber" TEXT NOT NULL,
    "preferredPaymentMethod" TEXT NOT NULL,
    "paymentTerm" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "creditLimit" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseReQEntry" (
    "id" TEXT NOT NULL,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "shipping" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "supplierId" TEXT NOT NULL,
    "purchaseAdditionalInfoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseReQEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseRequisitionEntryItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "purchaseReQEntryId" TEXT NOT NULL,

    CONSTRAINT "PurchaseRequisitionEntryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseAdditionalInfo" (
    "id" TEXT NOT NULL,
    "comment" TEXT,
    "deliverTo" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isUrgent" BOOLEAN NOT NULL,
    "prepay" BOOLEAN NOT NULL,
    "reqDate" TIMESTAMP(3) NOT NULL,
    "offload" BOOLEAN NOT NULL,
    "isDelivered" BOOLEAN NOT NULL,
    "purchaseReQEntryId" TEXT,

    CONSTRAINT "PurchaseAdditionalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierPaymentTracking" (
    "id" TEXT NOT NULL,
    "purchaseEntryId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "allocatedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierPaymentTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "gradeName" TEXT NOT NULL,
    "description" TEXT,
    "qualityLevel" TEXT NOT NULL,
    "materialQuality" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingSheet" (
    "id" TEXT NOT NULL,
    "baleName" TEXT NOT NULL,
    "baleWeight" DOUBLE PRECISION NOT NULL,
    "branch" TEXT NOT NULL,
    "comment" TEXT,
    "damageCount" INTEGER NOT NULL,
    "damageWeight" DOUBLE PRECISION NOT NULL,
    "gradeDate" TIMESTAMP(3) NOT NULL,
    "gradeReference" TEXT NOT NULL,
    "grader" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL,
    "itemtoGrade" TEXT,
    "unpairedCount" INTEGER NOT NULL,
    "workCenter" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Thrift',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradingSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradedItem" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "qtyToHold" INTEGER,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "qtyToDispatch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gradingSheetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PausedCart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PausedCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PausedCartItem" (
    "id" TEXT NOT NULL,
    "pausedCartId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "qty" INTEGER NOT NULL,
    "availableQty" INTEGER NOT NULL,

    CONSTRAINT "PausedCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mpesaReceipt" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "transactionTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BankName_bankCode_key" ON "BankName"("bankCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankName_branchCode_key" ON "BankName"("branchCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankName_email_key" ON "BankName"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Salesperson_salesCode_key" ON "Salesperson"("salesCode");

-- CreateIndex
CREATE UNIQUE INDEX "Salesperson_employeeCode_key" ON "Salesperson"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Salesperson_phone_key" ON "Salesperson"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Salesperson_email_key" ON "Salesperson"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branchCode_key" ON "Branch"("branchCode");

-- CreateIndex
CREATE UNIQUE INDEX "SalesArea_code_key" ON "SalesArea"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_code_key" ON "PaymentMethod"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SalesCategory_code_key" ON "SalesCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userName_key" ON "Driver"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shift_shiftCode_key" ON "Shift"("shiftCode");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleGeneralLedgerAccount_glAccountCode_key" ON "VehicleGeneralLedgerAccount"("glAccountCode");

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_categoryCode_key" ON "ItemCategory"("categoryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Item_code_key" ON "Item"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Item_barcode_key" ON "Item"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Tax_code_key" ON "Tax"("code");

-- CreateIndex
CREATE UNIQUE INDEX "SalesQuotation_deliveryDetailsId_key" ON "SalesQuotation"("deliveryDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "DirectSale_deliveryDetailsId_key" ON "DirectSale"("deliveryDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditStatus_code_key" ON "CreditStatus"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountCode_key" ON "BankAccount"("accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNumber_key" ON "BankAccount"("accountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SalesEntry_deliveryDetailsId_key" ON "SalesEntry"("deliveryDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "DesignationTitle_titleCode_key" ON "DesignationTitle"("titleCode");

-- CreateIndex
CREATE UNIQUE INDEX "SalesGroup_code_key" ON "SalesGroup"("code");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleExpenseCategory_code_key" ON "VehicleExpenseCategory"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_code_key" ON "Supplier"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseAdditionalInfo_purchaseReQEntryId_key" ON "PurchaseAdditionalInfo"("purchaseReQEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_code_key" ON "Grade"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_mpesaReceipt_key" ON "Payment"("mpesaReceipt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleGeneralLedgerAccount" ADD CONSTRAINT "VehicleGeneralLedgerAccount_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "SalesQuotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesQuotation" ADD CONSTRAINT "SalesQuotation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesQuotation" ADD CONSTRAINT "SalesQuotation_deliveryDetailsId_fkey" FOREIGN KEY ("deliveryDetailsId") REFERENCES "DeliveryDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectSale" ADD CONSTRAINT "DirectSale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectSale" ADD CONSTRAINT "DirectSale_deliveryDetailsId_fkey" FOREIGN KEY ("deliveryDetailsId") REFERENCES "DeliveryDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectSaleItem" ADD CONSTRAINT "DirectSaleItem_directSaleId_fkey" FOREIGN KEY ("directSaleId") REFERENCES "DirectSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesEntry" ADD CONSTRAINT "SalesEntry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesEntry" ADD CONSTRAINT "SalesEntry_deliveryDetailsId_fkey" FOREIGN KEY ("deliveryDetailsId") REFERENCES "DeliveryDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesEntry" ADD CONSTRAINT "SalesEntry_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES "Salesperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesEntryItem" ADD CONSTRAINT "SalesEntryItem_salesEntryId_fkey" FOREIGN KEY ("salesEntryId") REFERENCES "SalesEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignationTitle" ADD CONSTRAINT "DesignationTitle_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignationTitle" ADD CONSTRAINT "DesignationTitle_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReQEntry" ADD CONSTRAINT "PurchaseReQEntry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisitionEntryItem" ADD CONSTRAINT "PurchaseRequisitionEntryItem_purchaseReQEntryId_fkey" FOREIGN KEY ("purchaseReQEntryId") REFERENCES "PurchaseReQEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseAdditionalInfo" ADD CONSTRAINT "PurchaseAdditionalInfo_purchaseReQEntryId_fkey" FOREIGN KEY ("purchaseReQEntryId") REFERENCES "PurchaseReQEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradedItem" ADD CONSTRAINT "GradedItem_gradingSheetId_fkey" FOREIGN KEY ("gradingSheetId") REFERENCES "GradingSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PausedCartItem" ADD CONSTRAINT "PausedCartItem_pausedCartId_fkey" FOREIGN KEY ("pausedCartId") REFERENCES "PausedCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
