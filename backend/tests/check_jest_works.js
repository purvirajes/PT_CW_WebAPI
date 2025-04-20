//check that the npm environment has set the test DB correctly
test('Jest should use the test DB', () => {
  expect(process.env.DB_DATABASE || process.env.DB_NAME).toBeTruthy();
});

//this test fails because 1 !== 2, it is intentionally skipped tests (xit) to demo Jest functionality
xit('Testing to see if Jest works', () => {
    expect(1).toBe(2)
  })

//this passes because 1 === 1
xit('Testing to see if Jest works 2', () => {
    expect(1).toBe(1)
  })