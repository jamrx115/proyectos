<?php

class My_Api
{
	protected $data, $response;
	protected $uri = 'https://alltic.co';
	protected $path = '/televida/tv_time/api/v1/phprojekt.php';

	public function log($message) {
		$fp = fopen('mylog.log', 'a') or exit("Can't open Log file");
		fwrite($fp, 
			@date('[d/M/Y:H:i:s]') . 
			"(" . pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME) . ")" . 
			$message . PHP_EOL);
		fclose($fp);
	}
	
	public function setData($data) {
		$this->data = $data;
	}

	public function getData($data) {
		return $this->data;
	}

	protected function userAccess($client) {
		$user = Phprojekt_Auth_Proxy::getEffectiveUser();
		$client->getHttpClient()->setAuth($user->username, $this->getPasswordAccess($user), Zend_Http_Client::AUTH_BASIC);
		return $client;
	}

	protected function getPasswordAccess($user) {
		return md5($user->username . json_encode($this->data['data']) . '_4lLt1C001');
	}

	public function sendPostRequest() {
		$client = new Zend_Rest_Client($this->uri);
		$client = $this->userAccess($client);
		$this->response = $client->restPost($this->path, $this->data);
	}

	public function sendPutRequest() {
		$client = new Zend_Rest_Client($this->uri);
		$client = $this->userAccess($client);
		$this->response = $client->restPut($this->path, json_encode($this->data));
	}

	public function sendDeleteRequest() {
		$client = new Zend_Rest_Client($this->uri);
		$client = $this->userAccess($client);
		$this->response = $client->restDelete($this->path, json_encode($this->data));
	}

	public function getResponse() {
		//$this->log('Response: ' . $this->response->getBody());
		$responseRaw = json_decode($this->response->getBody());
		$response = ($responseRaw->code == 200) ? $responseRaw->data : false;
		return $response;
	}
}
