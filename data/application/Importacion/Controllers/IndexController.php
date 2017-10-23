<?php
/**
 * Importacion Module Controller for PHProjekt 6.0
 *
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3 as published by the Free Software Foundation
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * @category  PHProjekt
 * @package   Template
 * @copyright Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license   LGPL v3 (See LICENSE file)
 * @link      http://www.phprojekt.com
 * @since     File available since Release 6.0
 * @version   Release: 6.1.0
 * @author    Gustavo Solt <solt@mayflower.de>
 */

/**
 * Importacion Module Controller for PHProjekt 6.0
 *
 * @category  PHProjekt
 * @package   Template
 * @copyright Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license   LGPL v3 (See LICENSE file)
 * @link      http://www.phprojekt.com
 * @since     File available since Release 6.0
 * @version   Release: 6.1.0
 * @author    Gustavo Solt <solt@mayflower.de>
 */
class Importacion_IndexController extends IndexController
{

    public function jsonSaveAction()
    {
		$file = explode("|", $this->getRequest()->getParam('file'));

		$helper = new Importacion_Helper_Import();

		$helper->setFilePath(PHPR_UPLOAD_PATH);
		$helper->setFintern($file[0]);
		$helper->setFreal($file[1]);

		if ($helper->execFile()) {
			$return = array('type'    => 'success',
							'message' => 'success',
						'id'      => 1);

			Phprojekt_Converter_Json::echoConvert($return);
		}
    }
}
