import os
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

@pytest.mark.parametrize("filename", [
    ("basic1"),
])
def test_data(filename):
    # Get input
    in_filename = os.path.join(os.path.dirname(
        os.path.realpath(__file__)), '..', 'testdata', filename+'.in.xml'
    )
    with open(in_filename) as fp:
        in_data = fp.read()

    # get expected
    expected_filename = os.path.join(os.path.dirname(
        os.path.realpath(__file__)), '..', 'testdata', filename+'.out.html'
    )
    with open(expected_filename) as fp:
        expected_data = fp.read()

    # Get URL of test page
    test_page = os.path.join(os.path.dirname(
        os.path.realpath(__file__)), '..', 'test.html'
    )

    # Open Browser
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get("file://" + test_page)
    time.sleep(1)

    # Put data into form
    in_elem = driver.find_element_by_id("datain")
    in_elem.clear()
    in_elem.send_keys(in_data)

    # submit form
    driver.find_element_by_id("submit").click()
    time.sleep(1)

    # get result
    got_data = driver.find_element_by_id("results").get_attribute('innerHTML')

    # cleanup
    driver.close()

    # finally compare
    print(got_data)
    assert expected_data == got_data
