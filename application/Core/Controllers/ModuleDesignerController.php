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
 * @copyright  Copyright (c) 2010 Mayflower GmbH (http://www.mayflower.de)
 * @license    LGPL v3 (See LICENSE file)
 */

/**
 * Module Designer Controller.
 */
class Core_ModuleDesignerController extends Core_IndexController
{
    /**
     * Returns the data of each field of the module.
     *
     * OPTIONAL request parameters:
     * <pre>
     *  - integer <b>id</b> id of the item to consult.
     * </pre>
     *
     * @return void
     */
    public function jsonDetailAction()
    {
        $id           = (int) $this->getRequest()->getParam('id');
        $data         = array();
        $data['data'] = array();
        if (!empty($id)) {
            $module          = Phprojekt_Module::getModuleName($id);
            $model           = Phprojekt_Loader::getModel($module, $module);
            if ($model instanceof Phprojekt_Item_Abstract) {
                $databaseManager = new Phprojekt_DatabaseManager($model);
                $data['data']['definition'] = $databaseManager->getDataDefinition();
            } else {
                $data['data']['definition'] = 'none';
            }

            $data['data']['isUserModule'] = false;
            if (is_dir(PHPR_USER_CORE_PATH . $module)) {
                $data['data']['isUserModule'] = true;
            }
        } else {
            $data['data']['definition'] = array();
        }

        Phprojekt_Converter_Json::echoConvert($data);
    }

    /**
     * Saves the design of all the fields in the module.
     *
     * If the request parameter "id" is null or 0, the function will add a new module,
     * if the "id" is an existing module, the function will update it.
     *
     * The save action will try to add or update the module table itself and the database_manager.
     *
     * REQUIRES request parameters:
     * <pre>
     *  - integer <b>id</b>           id of the module to save.
     *  - string  <b>designerData</b> Data of the fields.
     *  - string  <b>name</b>         Name of the module.
     *  - string  <b>label</b>        Display of the module.
     * </pre>
     *
     * The return is a string in JSON format with:
     * <pre>
     *  - type    => 'success' or 'error'.
     *  - message => Success or error message.
     *  - id      => id of the module.
     * </pre>
     *
     * @throws Zend_Controller_Action_Exception On error in the action save.
     *
     * @return void
     */
    public function jsonSaveAction()
    {
        $id       = (int) $this->getRequest()->getParam('id');
        $data     = $this->getRequest()->getParam('designerData');
        $saveType = (int) $this->getRequest()->getParam('saveType');
        $model    = null;
        $module   = Cleaner::sanitize('alnum', $this->getRequest()->getParam('name', null));
        $this->setCurrentProjectId();

        if (empty($module)) {
            $module = Cleaner::sanitize('alnum', $this->getRequest()->getParam('label'));
        }
        $module = ucfirst(str_replace(" ", "", $module));
        $this->getRequest()->setParam('name', $module);

        if ($id > 0) {
            $model = Phprojekt_Loader::getModel($module, $module);
        }

        $message = $this->_handleDatabaseChange($model, $module, $data, $saveType, $id);

        if (!is_null($message)) {
            Phprojekt_Converter_Json::echoConvert($message);
            return;
        }

        $this->setCurrentProjectId();

        $message = '';

        if (empty($id)) {
            $model   = new Phprojekt_Module_Module();
            $message = Phprojekt::getInstance()->translate('The module was added correctly');
        } else {
            $model   = new Phprojekt_Module_Module();
            $model   = $model->find($id);
            $message = Phprojekt::getInstance()->translate('The module was edited correctly');
        }

        $model->saveModule($this->getRequest()->getParams());

        Phprojekt_Module::clearCache();

        $return = array(
            'type'    => 'success',
            'message' => $message,
            'id'      => $model->id
        );

        Phprojekt_Converter_Json::echoConvert($return);
    }

    private function _handleDatabaseChange($model, $module, $data, $saveType, $id)
    {
        $ret = array(
            'type' => null,
            'message' => null,
            'id'      => $id
        );

        if ($model instanceof Phprojekt_Item_Abstract || $id == 0) {
            $databaseManager = new Phprojekt_DatabaseManager($model);
            $data            = Zend_Json::decode($data);

            // Validate
            if ($databaseManager->recordValidate($data, $saveType)) {
                // Update Table Structure
                $tableData = $this->_getTableData($data);
                if (!$databaseManager->syncTable($data, $module, $tableData)) {
                    $ret['type']    = 'error';
                    $ret['message'] = Phprojekt::getInstance()->translate('There was an error writing the table');
                } else {
                    // remove possible id's as we are not allowed to change id's
                    foreach ($data as $key => $value) {
                        unset($data[$key]['id']);
                    }

                    // Update DatabaseManager Table
                    $databaseManager->saveData($module, $data, $tableData);

                    $ret = null;
                }
            } else {
                $error   = $databaseManager->getError();
                $ret['message'] = $error['label'] . ': ' . $error['message'];
                $ret['type']    = 'error';
            }
        } else {
            $ret = null;
        }

        return $ret;
    }

    /**
     * Get the length and type from the values.
     *
     * @param array $data Array $_POST values.
     *
     * @return array Array with data of the table.
     */
    private function _getTableData($data)
    {
        $tableData = array();

        foreach ($data as $field) {
            $field['tableField'] = Phprojekt_DatabaseManager::convertTableField($field['tableField']);

            $tableData[$field['tableField']]            = array();
            $tableData[$field['tableField']]['null']    = true;
            $tableData[$field['tableField']]['default'] = null;
            foreach ($field as $key => $value) {
                $value = null;
                if ($key == 'tableType') {
                    $tableData[$field['tableField']]['type'] = $field['tableType'];
                } else if ($key == 'tableLength') {
                    $tableData[$field['tableField']]['length'] = $field['tableLength'];
                }
            }
        }

        return $tableData;
    }
}
