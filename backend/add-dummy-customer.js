const prisma = require('./config/prisma');

async function addSegmentedCustomers() {
  try {
    console.log('🎯 Adding 5 customers for each segment...\n');

    const customers = [
      // VIP Customers
      {
        name: 'Michael Johnson',
        phone: '555-0101',
        city: 'Mumbai',
        totalOrders: 50,
        totalSpent: 15000.00,
        segment: 'VIP',
        status: 'active',
      },
      {
        name: 'Victoria Chen',
        phone: '555-0102',
        city: 'Chennai',
        totalOrders: 45,
        totalSpent: 14200.00,
        segment: 'VIP',
        status: 'active',
      },
      {
        name: 'Robert Williams',
        phone: '555-0103',
        city: 'Delhi',
        totalOrders: 52,
        totalSpent: 16500.00,
        segment: 'VIP',
        status: 'active',
      },
      {
        name: 'Amanda Scott',
        phone: '555-0104',
        city: 'Bangalore',
        totalOrders: 48,
        totalSpent: 15800.00,
        segment: 'VIP',
        status: 'active',
      },
      {
        name: 'James Martinez',
        phone: '555-0105',
        city: 'Hyderabad',
        totalOrders: 55,
        totalSpent: 17200.00,
        segment: 'VIP',
        status: 'active',
      },
      // High Spenders
      {
        name: 'Jennifer Lee',
        phone: '555-0201',
        city: 'Mumbai',
        totalOrders: 8,
        totalSpent: 8500.00,
        segment: 'High Spenders',
        status: 'active',
      },
      {
        name: 'Christopher Brown',
        phone: '555-0202',
        city: 'Chennai',
        totalOrders: 6,
        totalSpent: 7800.00,
        segment: 'High Spenders',
        status: 'active',
      },
      {
        name: 'Michelle Garcia',
        phone: '555-0203',
        city: 'Delhi',
        totalOrders: 7,
        totalSpent: 8200.00,
        segment: 'High Spenders',
        status: 'active',
      },
      {
        name: 'David Taylor',
        phone: '555-0204',
        city: 'Bangalore',
        totalOrders: 9,
        totalSpent: 9100.00,
        segment: 'High Spenders',
        status: 'active',
      },
      {
        name: 'Lisa Anderson',
        phone: '555-0205',
        city: 'Hyderabad',
        totalOrders: 8,
        totalSpent: 8600.00,
        segment: 'High Spenders',
        status: 'active',
      },
      // New Customers
      {
        name: 'David Chen',
        phone: '555-0301',
        city: 'Mumbai',
        totalOrders: 2,
        totalSpent: 250.00,
        segment: 'New Customer',
        status: 'active',
      },
      {
        name: 'Sarah Wilson',
        phone: '555-0302',
        city: 'Chennai',
        totalOrders: 1,
        totalSpent: 120.00,
        segment: 'New Customer',
        status: 'active',
      },
      {
        name: 'Kevin Johnson',
        phone: '555-0303',
        city: 'Delhi',
        totalOrders: 2,
        totalSpent: 380.00,
        segment: 'New Customer',
        status: 'active',
      },
      {
        name: 'Rachel Davis',
        phone: '555-0304',
        city: 'Bangalore',
        totalOrders: 1,
        totalSpent: 95.00,
        segment: 'New Customer',
        status: 'active',
      },
      {
        name: 'Tom Martinez',
        phone: '555-0305',
        city: 'Hyderabad',
        totalOrders: 3,
        totalSpent: 420.00,
        segment: 'New Customer',
        status: 'active',
      },
      // Lapsed Customers
      {
        name: 'Emily Rodriguez',
        phone: '555-0401',
        city: 'Mumbai',
        totalOrders: 12,
        totalSpent: 3200.00,
        segment: 'Lapsed Customer',
        status: 'inactive',
      },
      {
        name: 'Mark Thompson',
        phone: '555-0402',
        city: 'Chennai',
        totalOrders: 15,
        totalSpent: 4100.00,
        segment: 'Lapsed Customer',
        status: 'inactive',
      },
      {
        name: 'Patricia White',
        phone: '555-0403',
        city: 'Delhi',
        totalOrders: 10,
        totalSpent: 2800.00,
        segment: 'Lapsed Customer',
        status: 'inactive',
      },
      {
        name: 'Steven Harris',
        phone: '555-0404',
        city: 'Bangalore',
        totalOrders: 18,
        totalSpent: 4800.00,
        segment: 'Lapsed Customer',
        status: 'inactive',
      },
      {
        name: 'Nancy Clark',
        phone: '555-0405',
        city: 'Hyderabad',
        totalOrders: 11,
        totalSpent: 3000.00,
        segment: 'Lapsed Customer',
        status: 'inactive',
      },
    ];

    let segmentCount = {};
    
    for (const customerData of customers) {
      const email = `${customerData.name.toLowerCase().replace(' ', '.')}-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
      
      const customer = await prisma.customer.create({
        data: {
          ...customerData,
          email,
        },
      });

      segmentCount[customerData.segment] = (segmentCount[customerData.segment] || 0) + 1;
      console.log(`✅ ${customerData.name} (${customerData.segment}) | Orders: ${customerData.totalOrders} | Spent: $${customerData.totalSpent}`);
    }

    console.log('\n📊 Summary:');
    Object.entries(segmentCount).forEach(([segment, count]) => {
      console.log(`   ${segment}: ${count} customers added`);
    });
    console.log('\n🎉 Total 20 customers added across 4 segments!');
  } catch (error) {
    console.error('❌ Error adding customers:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addSegmentedCustomers();
