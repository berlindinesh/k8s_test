const profiles =  [
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "phone": "1234567890",
      "personalInfo": {
        "dateOfBirth": "1990-05-10",
        "gender": "Male",
        "address": "123 Maple St, Springfield",
        "country": "USA",
        "state": "Illinois",
        "city": "Springfield",
        "qualification": "MBA",
        "experience": 5,
        "maritalStatus": "Single"
      },
      "bankInfo": {
        "bankName": "Bank of America",
        "accountNumber": "123456789012",
        "branch": "Main Branch",
        "bankCode1": "BOFA",
        "bankAddress": "456 Elm St, Springfield",
        "bankCode2": "IL789"
      },
      "workInfo": {
        "department": "Finance",
        "shiftInfo": "Day",
        "jobPosition": "Financial Analyst",
        "workType": "Full-time",
        "salary": 60000,
        "joiningDate": "2023-03-01",
        "endDate": null,
        "workLocation": "Chicago Office"
      }
    },
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "password": "password123",
      "phone": "2345678901",
      "personalInfo": {
        "dateOfBirth": "1985-11-25",
        "gender": "Female",
        "address": "456 Oak St, Los Angeles",
        "country": "USA",
        "state": "California",
        "city": "Los Angeles",
        "qualification": "B.Tech",
        "experience": 8,
        "maritalStatus": "Married"
      },
      "bankInfo": {
        "bankName": "Wells Fargo",
        "accountNumber": "234567890123",
        "branch": "Sunset Blvd Branch",
        "bankCode1": "WF123",
        "bankAddress": "789 Sunset Blvd, Los Angeles",
        "bankCode2": "CA567"
      },
      "workInfo": {
        "department": "Engineering",
        "shiftInfo": "Night",
        "jobPosition": "Software Engineer",
        "workType": "Contract",
        "salary": 80000,
        "joiningDate": "2023-07-15",
        "endDate": "2024-07-14",
        "workLocation": "Remote"
      }
    },
    {
        "name": "Subi",
        "email": "Subi.123@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Kishan",
        "email": "kishan.143@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Ramachandran",
        "email": "ramachandran.12@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Dinesh",
        "email": "dinesh321@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Sundar",
        "email": "sundar.987@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Sanju",
        "email": "sanju.123@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Sangeeta",
        "email": "sangeeta.135@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Harish",
        "email": "harish.132@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Ricky",
        "email": "ricky.123@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Ricky Harish",
        "email": "ricky.harish@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Dilli",
        "email": "dilli.908@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "babu",
        "email": "babu.90@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "subramanyam",
        "email": "jane.smith@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Durga",
        "email": "durga.878@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      },
      {
        "name": "Prasad",
        "email": "prasad.567@example.com",
        "password": "password123",
        "phone": "2345678901",
        "personalInfo": {
          "dateOfBirth": "1985-11-25",
          "gender": "Female",
          "address": "456 Oak St, Los Angeles",
          "country": "USA",
          "state": "California",
          "city": "Los Angeles",
          "qualification": "B.Tech",
          "experience": 8,
          "maritalStatus": "Married"
        },
        "bankInfo": {
          "bankName": "Wells Fargo",
          "accountNumber": "234567890123",
          "branch": "Sunset Blvd Branch",
          "bankCode1": "WF123",
          "bankAddress": "789 Sunset Blvd, Los Angeles",
          "bankCode2": "CA567"
        },
        "workInfo": {
          "department": "Engineering",
          "shiftInfo": "Night",
          "jobPosition": "Software Engineer",
          "workType": "Contract",
          "salary": 80000,
          "joiningDate": "2023-07-15",
          "endDate": "2024-07-14",
          "workLocation": "Remote"
        }
      }
  ]
  

  export default profiles