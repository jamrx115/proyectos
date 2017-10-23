<?php
/**
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * @copyright  Copyright (c) 2011 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 */

/**
 * Api Module Controller.
 */
class Api_IndexController extends IndexController
{

    public function log($message) {
		$fp = fopen('mylog.log', 'a') or exit("Can't open Log file");
		fwrite($fp, 
			@date('[d/M/Y:H:i:s]') . 
			"(" . pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME) . ")" . 
			$message . PHP_EOL);
		fclose($fp);
	}
	
	public function preDispatch()
    {
        $this->_helper->viewRenderer->setNoRender(true);

	try {
		$authHeader = explode(':',base64_decode(substr($this->getRequest()->getHeader('Authorization'), 6)));

		Api_Helper_Auth::login($authHeader[0], $authHeader[1], $this->getRequest()->getParam('data'));

	} catch (Phprojekt_Auth_Exception $e) {
		$this->getResponse()->setBody(json_encode(array(
								'code' => 401,
								'error' => $e->getMessage()
								)
							)
						);		
		return false;
	}
    }

    public function indexAction()
    {
        
    }

    public function createtimeAction()
    {
	
	if( !Phprojekt_Auth::isLoggedIn() ) {
		$this->failedTransaction('', 401);
	}

	$helper = new Api_Helper_Time();
	$helper->setOptions((array) json_decode($this->getRequest()->getParam('data')));
	$helper->setTimecard();
	$helper->registerTime();

	$this->getResponse()->setBody(json_encode(array('code' => 200,
                        				'data' => array( 'ID' => $helper->getTimecard()->id)
							)
						)
					);

    }

    public function updatetimeAction()
    {
	if( !Phprojekt_Auth::isLoggedIn() ) {
		$this->failedTransaction('', 401);
	}

	$data = (array) json_decode($this->getRequest()->getParam('data'));

	$helper = new Api_Helper_Time();
	$helper->setOptions($data);
	$helper->setTimecard($data['timecard_id']);

	$helper->registerTime();

	$this->getResponse()->setBody(json_encode(array('code' => 200,
                        				'data' => array( 'ID' => $helper->getTimecard()->id)
							)
						)
					);
    }

    public function deletetimeAction()
    {
	if( !Phprojekt_Auth::isLoggedIn() ) {
		$this->failedTransaction('', 401);
	}
	
	if(!$this->getRequest()->getParam('timecard_id')) {
		$this->failedTransaction();
	}

	$data = (array) json_decode($this->getRequest()->getParam('data'));

	$helper = new Api_Helper_Time();
	$helper->setTimecard($data['timecard_id']);

	if( !$helper->deleteTime() ) {
		$this->failedTransaction();
	}

	$this->getResponse()->setBody(json_encode(array('code' => 200, 'data' => array('ID' => null) )));
    }

    public function failedTransaction($msj = '', $code = '400')
    {
	$this->getResponse()->setBody(json_encode(array('code' => $code, 'msj' => $msj )));
	
	exit();
    }

}