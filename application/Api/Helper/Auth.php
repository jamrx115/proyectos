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
 * Api Auth
 *
 * This class implements an authentication backend for Api
 */
class Api_Helper_Auth
{
    public function login($username, $password, $data)
    {
	$match = md5($username . $data . '_4lLt1C001');

	if($password !== $match) {
		throw new Phprojekt_Auth_Exception('Invalid user or password');
	}

	$user   = new Phprojekt_User_User();
        $userId = $user->findIdByUsername($username);

        if ($userId > 0) {
            $user->find($userId);
        } else {
            throw new Phprojekt_Auth_Exception('Invalid user or password');
        }

        if (!$user->isActive()) {
            throw new Phprojekt_Auth_Exception('User Inactive', 5);
        }

	$authNamespace = new Zend_Session_Namespace('Phprojekt_Auth-login');
        $authNamespace->userId = $user->id;
        $authNamespace->admin  = $user->admin;

	if (!headers_sent()) {
		Zend_Session::regenerateId();
        }
           
	return true;
    }
}
